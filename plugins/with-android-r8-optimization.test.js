const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const { AndroidConfig } = require('expo/config-plugins');

const {
  applyOptimizingProguardFile,
  applyR8GradleProperties,
} = require('./with-android-r8-optimization');

const { parsePropertiesFile, propertiesListToString } = AndroidConfig.Properties;

/** The tail of a prebuilt gradle.properties, comments and blank lines included. */
const GRADLE_PROPERTIES_FIXTURE = `# Use this property to enable or disable the Hermes JS engine.
hermesEnabled=true

expo.inlineModules.watchedDirectories=[]
android.enableMinifyInReleaseBuilds=true
android.enableShrinkResourcesInReleaseBuilds=true`;

/** The release block Expo's SDK 57 template generates. */
const BUILD_GRADLE_FIXTURE = `        release {
            signingConfig signingConfigs.debug
            minifyEnabled enableMinifyInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }`;

function readProperty(properties, key) {
  return properties.find((item) => item.type === 'property' && item.key === key)?.value;
}

function countProperty(properties, key) {
  return properties.filter((item) => item.type === 'property' && item.key === key).length;
}

describe('applyR8GradleProperties', () => {
  it('adds both R8 properties when neither is present', () => {
    const properties = applyR8GradleProperties(parsePropertiesFile(GRADLE_PROPERTIES_FIXTURE));

    assert.equal(readProperty(properties, 'android.enableR8.fullMode'), 'true');
    assert.equal(readProperty(properties, 'android.r8.optimizedResourceShrinking'), 'true');
  });

  it('leaves the properties expo-build-properties owns alone', () => {
    const properties = applyR8GradleProperties(parsePropertiesFile(GRADLE_PROPERTIES_FIXTURE));

    assert.equal(readProperty(properties, 'android.enableMinifyInReleaseBuilds'), 'true');
    assert.equal(readProperty(properties, 'android.enableShrinkResourcesInReleaseBuilds'), 'true');
    assert.equal(readProperty(properties, 'hermesEnabled'), 'true');
  });

  it('keeps comments and unrelated lines when serialized back', () => {
    const properties = applyR8GradleProperties(parsePropertiesFile(GRADLE_PROPERTIES_FIXTURE));
    const serialized = propertiesListToString(properties);

    assert.match(serialized, /# Use this property to enable or disable the Hermes JS engine\./);
    assert.match(serialized, /expo\.inlineModules\.watchedDirectories=\[\]/);
    assert.match(serialized, /android\.r8\.optimizedResourceShrinking=true/);
  });

  it('overwrites a property that is present with the wrong value', () => {
    const properties = applyR8GradleProperties(
      parsePropertiesFile(`${GRADLE_PROPERTIES_FIXTURE}\nandroid.enableR8.fullMode=false`)
    );

    assert.equal(readProperty(properties, 'android.enableR8.fullMode'), 'true');
    assert.equal(countProperty(properties, 'android.enableR8.fullMode'), 1);
  });

  it('is idempotent, so a second run adds no duplicate', () => {
    const once = applyR8GradleProperties(parsePropertiesFile(GRADLE_PROPERTIES_FIXTURE));
    const twice = applyR8GradleProperties(once);

    assert.equal(countProperty(twice, 'android.enableR8.fullMode'), 1);
    assert.equal(countProperty(twice, 'android.r8.optimizedResourceShrinking'), 1);
  });
});

describe('applyOptimizingProguardFile', () => {
  it('swaps the default ProGuard file for the optimizing variant', () => {
    const contents = applyOptimizingProguardFile(BUILD_GRADLE_FIXTURE);

    assert.match(contents, /getDefaultProguardFile\("proguard-android-optimize\.txt"\)/);
    assert.doesNotMatch(contents, /getDefaultProguardFile\("proguard-android\.txt"\)/);
  });

  it('keeps the rest of the release block untouched', () => {
    const contents = applyOptimizingProguardFile(BUILD_GRADLE_FIXTURE);

    assert.match(contents, /minifyEnabled enableMinifyInReleaseBuilds/);
    assert.match(contents, /"proguard-rules\.pro"/);
    assert.match(contents, /signingConfig signingConfigs\.debug/);
  });

  it('is idempotent, so a second run is a no-op', () => {
    const once = applyOptimizingProguardFile(BUILD_GRADLE_FIXTURE);

    assert.equal(applyOptimizingProguardFile(once), once);
  });

  it('throws when the template no longer references either ProGuard file', () => {
    assert.throws(
      () => applyOptimizingProguardFile('        release {\n            minifyEnabled true\n        }'),
      /could not find getDefaultProguardFile/
    );
  });
});

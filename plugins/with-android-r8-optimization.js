const { withAppBuildGradle, withGradleProperties } = require('expo/config-plugins');

/**
 * Gradle properties Play's "Improve your app's memory and performance with R8
 * optimization" action asks for and that `expo-build-properties` does not write:
 *
 * - `android.enableR8.fullMode` runs R8 in full mode rather than ProGuard
 *   compatibility mode. AGP 8 already defaults to full mode, so this is a guard
 *   against a future template turning it off, not a change in itself.
 * - `android.r8.optimizedResourceShrinking` lets R8 shrink resources alongside
 *   the code rather than in a separate, more conservative pass. It needs
 *   `shrinkResources`, which `expo-build-properties` turns on through
 *   `enableShrinkResourcesInReleaseBuilds` in app.json.
 *
 * `android/` is gitignored, so anything set there by hand is lost on the next
 * prebuild. These have to live in a config plugin to reach an EAS release build.
 */
const R8_PROPERTIES = [
  ['android.enableR8.fullMode', 'true'],
  ['android.r8.optimizedResourceShrinking', 'true'],
];

const DEFAULT_PROGUARD_FILE = 'getDefaultProguardFile("proguard-android.txt")';
const OPTIMIZING_PROGUARD_FILE = 'getDefaultProguardFile("proguard-android-optimize.txt")';

/**
 * Sets the R8 properties on a parsed gradle.properties, updating any that are
 * already there rather than adding a second, losing copy. Mutates and returns
 * the list, matching how config plugin mods hand their `modResults` around.
 *
 * @param {import('expo/config-plugins').AndroidConfig.Properties.PropertiesItem[]} properties
 */
function applyR8GradleProperties(properties) {
  for (const [key, value] of R8_PROPERTIES) {
    const existing = properties.find(
      (item) => item.type === 'property' && item.key === key
    );

    if (existing) {
      existing.value = value;
      continue;
    }

    properties.push({ type: 'property', key, value });
  }

  return properties;
}

/**
 * Swaps the release build's default ProGuard config for the optimizing variant.
 *
 * The template Expo prebuilds points at `proguard-android.txt`, which carries a
 * bare `-dontoptimize`, so R8 shrinks the app but never optimizes it no matter
 * what `minifyEnabled` says. `-dontoptimize` cannot be undone by rules appended
 * later, so the file itself has to change.
 *
 * Throws when neither file is referenced: that means the template moved, and a
 * release that silently stopped optimizing is the outcome worth failing over.
 *
 * @param {string} contents android/app/build.gradle
 */
function applyOptimizingProguardFile(contents) {
  if (contents.includes(OPTIMIZING_PROGUARD_FILE)) {
    return contents;
  }

  if (!contents.includes(DEFAULT_PROGUARD_FILE)) {
    throw new Error(
      `with-android-r8-optimization: could not find ${DEFAULT_PROGUARD_FILE} in android/app/build.gradle. ` +
        'The template likely changed, so check whether the release build still disables R8 optimization.'
    );
  }

  return contents.replace(DEFAULT_PROGUARD_FILE, OPTIMIZING_PROGUARD_FILE);
}

/**
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
const withAndroidR8Optimization = (config) => {
  const withProperties = withGradleProperties(config, (gradleConfig) => {
    applyR8GradleProperties(gradleConfig.modResults);
    return gradleConfig;
  });

  return withAppBuildGradle(withProperties, (gradleConfig) => {
    gradleConfig.modResults.contents = applyOptimizingProguardFile(
      gradleConfig.modResults.contents
    );
    return gradleConfig;
  });
};

module.exports = withAndroidR8Optimization;
module.exports.applyR8GradleProperties = applyR8GradleProperties;
module.exports.applyOptimizingProguardFile = applyOptimizingProguardFile;
module.exports.R8_PROPERTIES = R8_PROPERTIES;

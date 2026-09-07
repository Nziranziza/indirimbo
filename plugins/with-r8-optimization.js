const { withAppBuildGradle, withGradleProperties } = require('expo/config-plugins');

/**
 * Turns on the two R8 settings Play Console reports as missing. Neither can be
 * expressed through expo-build-properties, which exposes no `proguardFiles`
 * option and no way to set an arbitrary Gradle property.
 *
 * For the avoidance of doubt: minification itself is already on and has been
 * since March 2026 — both the 1.6.0 and 1.6.1 bundles ship a byte-identical R8
 * mapping file. What is missing is narrower than "R8 is off":
 *
 * 1. React Native's generated `app/build.gradle` points at the stock
 *    `proguard-android.txt`, and that file contains `-dontoptimize`. Shrinking and
 *    obfuscation still run — which is why Play reports R8 full mode and resource
 *    shrinking as enabled — but the optimization pass never does, which is the
 *    "Optimization isn't enabled" line. The `-optimize` variant of the same file
 *    is identical apart from that switch, so this swaps to it. No ProGuard
 *    directive undoes `-dontoptimize`, so appending rules cannot fix it and the
 *    build.gradle itself has to change.
 *
 * 2. `android.r8.optimizedResourceShrinking` folds resource shrinking into R8's
 *    code analysis, so resources reachable only from stripped code go too. AGP 9
 *    does this whenever resource shrinking is on; on AGP 8.12 — the version React
 *    Native 0.86 pins — it needs the flag.
 *
 * The third thing Play asks for, AGP 9, is not actionable here: the version comes
 * from React Native's own `gradle/libs.versions.toml`, not from this project.
 */

const STOCK_PROGUARD_FILE = 'getDefaultProguardFile("proguard-android.txt")';
const OPTIMIZED_PROGUARD_FILE = 'getDefaultProguardFile("proguard-android-optimize.txt")';

const OPTIMIZED_RESOURCE_SHRINKING = 'android.r8.optimizedResourceShrinking';

/** @type {import('expo/config-plugins').ConfigPlugin} */
const withOptimizedProguardFile = (config) =>
  withAppBuildGradle(config, (gradleConfig) => {
    const contents = gradleConfig.modResults.contents;

    if (contents.includes(OPTIMIZED_PROGUARD_FILE)) {
      return gradleConfig;
    }
    // Fail loudly rather than prebuilding an app that quietly lost the setting.
    // An Expo or React Native upgrade rewrites this file, and a silent no-op here
    // is exactly the kind of thing that goes unnoticed for releases at a time.
    if (!contents.includes(STOCK_PROGUARD_FILE)) {
      throw new Error(
        `with-r8-optimization: could not find ${STOCK_PROGUARD_FILE} in app/build.gradle. ` +
          'React Native likely changed its template — check whether the default ProGuard ' +
          'file still carries -dontoptimize, then update this plugin.',
      );
    }

    gradleConfig.modResults.contents = contents.replace(
      STOCK_PROGUARD_FILE,
      OPTIMIZED_PROGUARD_FILE,
    );
    return gradleConfig;
  });

/** @type {import('expo/config-plugins').ConfigPlugin} */
const withOptimizedResourceShrinking = (config) =>
  withGradleProperties(config, (gradleConfig) => {
    gradleConfig.modResults = [
      ...gradleConfig.modResults.filter(
        (item) => !(item.type === 'property' && item.key === OPTIMIZED_RESOURCE_SHRINKING),
      ),
      { type: 'property', key: OPTIMIZED_RESOURCE_SHRINKING, value: 'true' },
    ];
    return gradleConfig;
  });

/** @type {import('expo/config-plugins').ConfigPlugin} */
const withR8Optimization = (config) =>
  withOptimizedResourceShrinking(withOptimizedProguardFile(config));

module.exports = withR8Optimization;

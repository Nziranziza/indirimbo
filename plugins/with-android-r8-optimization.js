const { withAppBuildGradle, withGradleProperties } = require('expo/config-plugins');

/**
 * Gradle properties Play's "Improve your app's memory and performance with R8
 * optimization" action asks for and that `expo-build-properties` does not write:
 *
 * - `android.enableR8.fullMode` runs R8 in full mode rather than ProGuard
 *   compatibility mode.
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
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
const withR8GradleProperties = (config) =>
  withGradleProperties(config, (gradleConfig) => {
    for (const [key, value] of R8_PROPERTIES) {
      const existing = gradleConfig.modResults.find(
        (item) => item.type === 'property' && item.key === key
      );

      if (existing) {
        existing.value = value;
        continue;
      }

      gradleConfig.modResults.push({ type: 'property', key, value });
    }

    return gradleConfig;
  });

/**
 * Swaps the release build's default ProGuard config for the optimizing variant.
 *
 * The template Expo prebuilds points at `proguard-android.txt`, which carries a
 * bare `-dontoptimize`, so R8 shrinks the app but never optimizes it no matter
 * what `minifyEnabled` says. `-dontoptimize` cannot be undone by rules appended
 * later, so the file itself has to change.
 *
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
const withOptimizingProguardFile = (config) =>
  withAppBuildGradle(config, (gradleConfig) => {
    const contents = gradleConfig.modResults.contents;

    if (contents.includes(OPTIMIZING_PROGUARD_FILE)) {
      return gradleConfig;
    }

    if (!contents.includes(DEFAULT_PROGUARD_FILE)) {
      throw new Error(
        `with-android-r8-optimization: could not find ${DEFAULT_PROGUARD_FILE} in android/app/build.gradle. ` +
          'The template likely changed, so check whether the release build still disables R8 optimization.'
      );
    }

    gradleConfig.modResults.contents = contents.replace(
      DEFAULT_PROGUARD_FILE,
      OPTIMIZING_PROGUARD_FILE
    );

    return gradleConfig;
  });

/**
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
const withAndroidR8Optimization = (config) =>
  withOptimizingProguardFile(withR8GradleProperties(config));

module.exports = withAndroidR8Optimization;

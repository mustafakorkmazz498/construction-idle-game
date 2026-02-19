# construction-idle

Expo + TypeScript game scaffold with Expo Router and clean domain-first folder structure.

## Requirements

- Node.js 20+
- npm 10+
- Expo Go on mobile device (optional)
- Android Studio / Xcode for native simulators (optional)

## Install

```bash
npm install
```

## Run (development)

```bash
npm run start
```

Then press:

- `a` for Android
- `w` for Web
- `i` for iOS (macOS only)

Direct commands:

```bash
npm run android
npm run web
npm run ios
```

## Build

Local JS bundle validation:

```bash
npx expo export --platform web
```

Production native builds (EAS):

```bash
npx eas build --platform android
npx eas build --platform ios
```

### EAS profiles

Project includes [`eas.json`](eas.json) with:

- `development` profile (internal/dev client, Android APK)
- `production` profile (store build, Android AAB)

Login once:

```bash
npx eas login
```

Configure build credentials:

```bash
npx eas build:configure
```

#### Android APK (internal testing)

```bash
npx eas build --platform android --profile development
```

#### Android AAB (Play Store)

```bash
npx eas build --platform android --profile production
```

#### iOS build (TestFlight/App Store)

```bash
npx eas build --platform ios --profile production
```

You can submit store-ready builds with:

```bash
npx eas submit --platform android --profile production
npx eas submit --platform ios --profile production
```

## Test / Quality checks

Type check:

```bash
npx tsc --noEmit
```

If you add tests later (Jest), use:

```bash
npm test
```

Lint:

```bash
npm run lint
```

Combined typecheck command:

```bash
npm run typecheck
```

## Troubleshooting (Skia + Reanimated)

### 1) Reanimated plugin/order issues

Symptoms:

- red screen about worklets
- animations not running

Checks:

- Ensure Reanimated Babel plugin is present in [`babel.config.js`](babel.config.js) and stays last.
- Clear Metro cache:

```bash
npx expo start -c
```

### 2) Skia native module build/link errors

Symptoms:

- app crash on startup after installing Skia
- native build errors mentioning Skia

Checks:

- Reinstall dependencies cleanly:

```bash
rm -rf node_modules
npm install
```

- Regenerate native cache/build artifacts by re-running EAS build.

### 3) Android performance issues (Skia/Reanimated)

If frame time spikes:

- Reduce animation density and expensive per-frame allocations.
- Disable physics in app settings (low-end mode path).
- Prefer fixed-step simulation and lightweight draw primitives.

### 4) Audio/Haptics no output

If no tap/purchase/project-complete feedback:

- Check in-app Sound/Haptics toggles in Settings.
- Confirm physical device volume/mute state and permissions.
- Restart app after toggling system-level sound/haptics settings.

## Folder structure

```text
src/
  app/
    layouts/
    screens/
  game/
    loop/
    world/
    entities/
    systems/
  features/
    economy/
    upgrades/
    projects/
  storage/
    save/
    load/
  ui/
    components/
  assets/
```


---
title: Cursor for Android — First App Guide
date: 2025-11-04
description: Template article with images and step-by-step instructions to create your first Android app using Cursor.
---

# Cursor for Android — First App Guide

> This is a ready-to-edit template article. Replace screenshots and tweak steps to match your setup.

<img src="https://placehold.co/960x480/0a0c10/00ffc6?text=Cursor+x+Android" alt="Cursor + Android" width="820" />

## Prerequisites

- Cursor installed (Stable or Insiders)
- Android Studio (for SDK Manager, AVD, Gradle toolchain)
- JDK 17+ (Android Studio includes a JDK)
- Git configured (optional but recommended)

## 1) Install Android SDK and Tools

1. Open Android Studio → More Actions → SDK Manager.
2. Install: Android SDK Platform (latest), Android SDK Platform-Tools, Android SDK Build-Tools.
3. Tools tab → Android Emulator.
4. Create a virtual device (Pixel 7) via AVD Manager.

<img src="https://placehold.co/960x540/0e1220/00ffc6?text=Android+SDK+Manager" alt="Android SDK Manager" width="820" />

## 2) Create a New Android Project

1. In Android Studio: New Project → "Empty Activity" (Kotlin).
2. Name: `HelloCursor` • Package: `com.example.hellocursor` • Min SDK: 24+.
3. Wait for Gradle sync to finish.

<img src="https://placehold.co/960x540/0e1220/00ffc6?text=New+Android+Project" alt="New Android Project" width="820" />

## 3) Open the Project in Cursor

1. In Cursor, File → Open Folder… → choose your `HelloCursor` project root.
2. Check that the Kotlin/Gradle plugins load (first index may take a moment).
3. Ensure Cursor uses your system JDK if prompted (`JAVA_HOME`).

## 4) Run on Emulator

1. Start the Pixel 7 AVD from Android Studio.
2. Back in Cursor, open the integrated terminal and run:

```bash
./gradlew installDebug
adb shell am start -n com.example.hellocursor/.MainActivity
```

If you prefer Android Studio to deploy, that's fine—Cursor will still edit the code.

## 5) Ask Cursor to Build the UI

Open `app/src/main/java/.../MainActivity.kt` and ask:

> "Convert activity to Jetpack Compose, create a neon button that increments a counter, and center it on screen."

Example Compose scaffold:

```kotlin
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContent {
      var count by remember { mutableStateOf(0) }
      Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Button(
          onClick = { count++ },
          colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00FFC6))
        ) { Text("Clicked $count times") }
      }
    }
  }
}
```

> Tip: If Compose isn’t enabled, ask Cursor: "Add Compose to this module and update Gradle," then sync.

## 6) Run Again

```bash
./gradlew :app:assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.example.hellocursor/.MainActivity
```

<img src="https://placehold.co/960x540/0e1220/00ffc6?text=First+Run+on+Emulator" alt="First run on emulator" width="820" />

## 7) Add an Image

1. Drop an image into `app/src/main/res/drawable/` (e.g., `neon_grid.png`).
2. Update your Composable to show an `Image` above the button.

```kotlin
Image(
  painter = painterResource(R.drawable.neon_grid),
  contentDescription = null,
  modifier = Modifier.fillMaxWidth().padding(16.dp)
)
```

## 8) Next Steps

- Ask Cursor to generate unit tests with `JUnit` + `Robolectric`.
- Add a second screen and navigate using `Navigation Compose`.
- Wire a network call with `Retrofit` + `OkHttp`.

<img src="https://placehold.co/900x300/0a0c10/00ffc6?text=Hello+Cursor+%E2%80%94+Complete" alt="Hello Cursor — Complete" width="760" />

---

## Resources

- Android Studio downloads: https://developer.android.com/studio
- SDK Manager docs: https://developer.android.com/tools/sdkmanager
- AVD Manager docs: https://developer.android.com/studio/run/managing-avds
- Jetpack Compose: https://developer.android.com/jetpack/compose
- Navigation Compose: https://developer.android.com/jetpack/compose/navigation
- Retrofit: https://square.github.io/retrofit/
- OkHttp: https://square.github.io/okhttp/
- Robolectric: https://robolectric.org/
- Kotlin: https://kotlinlang.org/docs/home.html



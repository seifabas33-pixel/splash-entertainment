# splash entertainment
splash entertainment

## Mobile Application (React Native)

This repository will host a cross-platform mobile app built with **React Native**. Below are the steps to get started.

### Prerequisites

1. **Node.js & npm**: Install from https://nodejs.org/ (LTS recommended).
2. **React Native CLI**: Install globally with `npm install -g react-native-cli`.
3. **Android Studio / Xcode**: Depending on your target platform(s), set up the corresponding SDKs and emulators.

> _Note_: React Native also supports Windows development via `react-native-windows` if needed.

### Creating the Project

Choose a project name without spaces (e.g. `SplashEntertainment`):

```powershell
npx react-native init SplashEntertainment
```

This will generate a new folder named `SplashEntertainment` with the standard React Native structure.

### Running the App

1. `cd SplashEntertainment`
2. For Android: `npx react-native run-android` (ensure an emulator or device is connected)
3. For iOS (macOS only): `npx react-native run-ios`

Refer to the [React Native documentation](https://reactnative.dev/docs/getting-started) for more details on setup, debugging, and deployment.

---

## Web Server for Hotel Listings

A simple Node.js/Express backend lives alongside the mobile project. It can serve a basic website with a `/hotels` route resembling the page at `https://splash-agency.net/hotels`.

### Setup

1. **Install dependencies** in the repository root:
   ```powershell
   npm install
   ```
   This installs `express` which the server uses.

2. **Start the server**:
   ```powershell
   node server.mjs
   ```

3. Open your browser to [http://127.0.0.1:3000/hotels](http://127.0.0.1:3000/hotels) to view the example hotels page.

### Extending the Site

- Add new hotel entries in `data/hotels.js` (or adjust the array inside the server file).
- Place static assets (images, CSS) under `public/`.

#### Mobile app integration

The server exposes a JSON API at `/api/hotels` which responds with the hotel list. Your React Native app can fetch this endpoint. You can use the built-in `fetch` API or a library like **axios**:

```js
import axios from 'axios';

axios.get('http://127.0.0.1:3000/api/hotels')
  .then(response => {
    console.log(response.data);
  });
```

`axios` is already added to the root `package.json` so install dependencies with `npm install` before running the server.

Use this data to populate screens or cache locally.

- Replace placeholder content with real resort descriptions, images, and links.

---

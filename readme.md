# Typy

Typy allows to take short notes on your desktop with Markdown for Windows (Electron).

## Demo

See Typy in action with these demo videos:

### Demo 1 - Basic Usage
<video width="100%" controls>
  <source src="resources/demo-1.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

### Demo 2 - Advanced Features
<video width="100%" controls>
  <source src="resources/demo-2.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## How to package Typy as a standalone Windows app

1. Open a terminal in the project directory.
2. Run the following command:

   ```powershell
   npx electron-packager . Typy --platform=win32 --arch=x64 --out=dist --overwrite
   ```

3. The packaged app will be in the `dist/Typy-win32-x64` folder. Run or distribute `Typy.exe` from there.

- Make sure you have run `npm install` before packaging.
- You can customize the icon and other options using electron-packager flags. See the [electron-packager documentation](https://github.com/electron/electron-packager) for more details.

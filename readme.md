# Typy

A minimal Markdown editor for Windows (Electron).

## How to package Typy as a standalone Windows app

1. Open a terminal in the project directory.
2. Run the following command:

   ```powershell
   npx electron-packager . Typy --platform=win32 --arch=x64 --out=dist --overwrite
   ```

3. The packaged app will be in the `dist/Typy-win32-x64` folder. Run or distribute `Typy.exe` from there.

- Make sure you have run `npm install` before packaging.
- You can customize the icon and other options using electron-packager flags. See the [electron-packager documentation](https://github.com/electron/electron-packager) for more details.

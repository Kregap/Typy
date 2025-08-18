# Typy

Typy allows to take short notes on your desktop with Markdown for Windows (Electron).

## Demo

See Typy in action with these demo videos:

### Demo 1 - Basic Usage
https://github.com/user-attachments/assets/54a9bf71-180c-4c71-9fbf-3259a37c4f1b

### Demo 2 - Advanced Features
https://github.com/user-attachments/assets/a1c683cb-3dd0-4806-80bd-c475f3ffad0a

## How to package Typy as a standalone Windows app

1. Open a terminal in the project directory.
2. Run the following command:

   ```powershell
   npx electron-packager . Typy --platform=win32 --arch=x64 --out=dist --overwrite
   ```

3. The packaged app will be in the `dist/Typy-win32-x64` folder. Run or distribute `Typy.exe` from there.

- Make sure you have run `npm install` before packaging.
- You can create a zip from the build with `powershell Compress-Archive -Path dist\Typy-win32-x64\* -DestinationPath dist\Typy-win32-x64.zip -Force`.
- You can customize the icon and other options using electron-packager flags. See the [electron-packager documentation](https://github.com/electron/electron-packager) for more details.

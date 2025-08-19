# Convert SVG to ICO (Windows icon) for Electron app
# Requirements: inkscape, imagemagick (convert)
# Usage: Run this script in PowerShell in the Typy folder

# Convert SVG to PNG at multiple sizes
$svg = "icon.svg"
$sizes = @(16, 32, 48, 64, 128, 256)
foreach ($size in $sizes) {
    inkscape -o "icon-$size.png" -w $size -h $size $svg
}
# Combine PNGs into a single ICO file
magick convert icon-16.png icon-32.png icon-48.png icon-64.png icon-128.png icon-256.png icon.ico
# Clean up PNGs
Remove-Item icon-*.png
Write-Host "icon.ico created."

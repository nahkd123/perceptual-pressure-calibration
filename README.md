# Perceptual Pressure Calibration
Calibrate the pressure of your favorite pressure-sensitive stylus.

## Instructions
0. Make sure you are using browser with pressure-sensitive stylus support. If you are using Chromium browser on Windows, make sure **Windows Ink** is enabled in tablet driver.
0. Visit https://nahkd123.github.io/perceptual-pressure-calibration. You will be in testing mode by default, which allows you to test your pen.
0. Click on "Calibrate" button to enter calibration mode.
0. Draw on the drawing area/canvas such that the pressure increases "linearly" as you move the pen.
0. Click on "Test" button to enter test mode and see if you are happy with the result.
0. Keep calibrating until you are happy with the result.
0. Click on "Export as CSV" to export the pressure calibration profile as CSV (Comma-separated values) file. This file can then be used with OpenTabletDriver plugin to apply global pressure calibration, or open in Excel for analysis.

## License
[MIT License](./LICENSE)
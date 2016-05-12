# Adding new social icons

You can use [icomoon](https://icomoon.io/app/) to add social icons by importing the current icons into the app:

1. Import the current set of icons into icomoon by clicking on "Import Icons" and selecting the file `selection.json`, located inside this folder.

2. Add new icons by using import icons and select new SVG files.

3. Select all of the icons (previous icons + your new icons). You can select wich characters to give to your new icons in this step.

5. Next, click on "Generate Font" and download the package. From the package, open `styles.css` and copy newly created icons css classes to update `lib/css/zocial.less` using the corresponging character for your icons. Ensure to update the classes, for instance `.zocial-bitbucket` should be turned into `.zocial.bitbucket`. Also add a declaration for the colors in the same file. The [BrandColors](http://brandcolors.net/) website may come handy.

6. Update the `selection.json` file with the one contained in the package downloaded in the previous step and the font files in `src`.

7. Replace the `src` attribute on the `@font-face` declaration that includes the font in base 64 in the `zocial.less` file. You can use `base64 support/fonts/src/zocial.woff | pbcopy`.

8. If you made changes to an icon that now requires different colors, you may need to increase the font version number in the `Gruntfile` and update the `src` attribute on the `@font-face` declartions that should link to the new version in the `zocial.less` file.

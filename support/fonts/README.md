# Adding new social icons

You can use [icomoon](https://icomoon.io/app/) to add social icons by importing the current icons into the app:

1. Import the current set of icons into icomoon by clicking on "Import Icons" and selecting the file `selection.json`, located inside this folder.

2. Add new icons by using import icons and select new SVG files.

3. Select all of the icons (previous icons + your new icons). You can select wich characters to give to your new icons in this step.

5. Next, click on "Generate Font" and download the package. From the package, open `styles.css` and copy newly created icons css classes to update `lib/css/zocial.less` using the corresponging character for your icons. For example, if your icon is named `.icon-twitter`, add it as `.zocial.twitter`.

6. Replace the `src` attribute on the `@font-face` declaration that includes the font `Zocial`.
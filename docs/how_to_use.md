# How to Start a New Project from this Template

Follow this exact step-by-step checklist whenever initializing a new coding workspace.

## Step 1: Duplicate and Sandbox
1. Generate a new repository on GitHub using this project as the template.
2. Clone the new repository to your local desktop machine.
3. Open `utilities/config.js` and immediately change `window.APP_CONFIG.prefix` to a unique name matching your new project (e.g., "TRACKER_V2_") to prevent LocalStorage collisions.

## Step 2: Establish the Data Schema
1. Define your empty state collections inside `window.APP_CONFIG` in `utilities/config.js`.
2. Add the names of any default JSON data profile sheets you want to automatically load into your project inside `utilities/dataList.txt`. Place those matching raw data `.json` files inside the `data/` folder.

## Step 3: Engineering Components (The "One File, One Function" rule)
1. When creating a new UI view or layout panel, create a matching pair of files:
   * A JS file in `js/components/` (e.g., `listBuilder.js`) that exports exactly one function matching the filename.
   * A CSS file in `css/components/` (e.g., `listBuilder.css`) containing its layout parameters.
2. Open `css/styles.css` and use an @import statement to link your new component stylesheet: `@import "components/listBuilder.css";`.

## Step 4: Wire Everything into the Conductor
1. Open `js/main.js`.
2. Import your new component modules at the very top of the script using relative paths.
3. Inside the `startProjectUI()` function, call your component functions, passing the data parameters from `window.DATA` and injecting them into your target wireframe layout containers.

# Architecture and Coding Standards Blueprint

## 1. Structural Architecture

*   **Modular "One File, One Function"**
    *   Every logic and component file must contain exactly one primary function or class.
    *   The exported function name must match the filename case-sensitively (e.g., `cardBuilder.js` exports `cardBuilder`).
*   **Directory Separation**
    *   `js/logic/`: Dedicated strictly to application state, algorithms, and data calculations.
    *   `js/components/`: Dedicated to presentation, DOM injection, and specific UI elements.
    *   `js/vender/`: Third-party library storage (e.g., jQuery, jQuery-UI). Do not link to external CDNs.
    *   `utilities/`: Global structural tools, system configuration, and engine scripts.
*   **Hybrid Script Loading Layer**
    *   **Global Layer:** Foundation libraries (jQuery), configuration profiles (`config.js`), and the global DOM engine (`dom.js`) are loaded as traditional top-level scripts.
    *   **Module Layer:** Core features, logic systems, components, and the main application coordinator (`main.js`) must be loaded as native ES6 modules (`type="module"`).

## 2. Development Standards

*   **Dynamic DOM Construction**
    *   `index.html` must remain an empty wireframe shell.
    *   All UI structures, layout matrices, elements, and data records must be dynamically constructed in memory using the `dom.create` utility engine.
*   **State Mirroring Strategy**
    *   The direct working state lives inside the browser's `LocalStorage`.
    *   `dbSync.js` acts as an automated pipeline bridge, mirroring that active cache into an SQLite database file via the PHP background services.
*   **CSS Micro-Modularity**
    *   `css/styles.css` acts as the single primary style link in your HTML.
    *   All individual component styles must be broken into micro-files matching their JS counterparts (e.g., `css/components/cardBuilder.css`) and pulled into the master sheet using explicit `@import` rules.

## 3. Data Flow and Persistence

*   **Prefix Namespacing**
    *   To prevent cross-project collisions on a local development host, every project configuration must supply a unique app-specific string prefix (e.g., `HOUSEHOLD_`).
    *   All `LocalStorage` variables are automatically isolated using this prefix.
*   **Atomic PHP Bridge Operations**
    *   `save_to_db.php` accepts mass state dumps and wraps them inside an exclusive SQLite Database Transaction for high-speed disk writing and write-failure recovery.
    *   `read_db.php` reads the local data payload and extracts it back into clean object namespaces for browser processing.

## 4. Lifecycle Execution Flow

The system initialization behaves like a sequential pipeline:
1.  **HTML Setup:** Loads the base document skeleton, global library layers, and structural layout sheets.
2.  **`main.js` Execution:** Boots on DOM content ready, rendering the core layout structural nodes (navigation bars, status rails, empty application grid).
3.  **`dbSync` Interception:** Hydrates and updates local browser caches against your underlying file data specifications.
4.  **Application Logic Lifecycle:** The core business logicians (such as a `taskManager`) consume the synced storage array data and trigger UI components to fill out the workspace frame.

/**
 * Project: Bible Presentation Exhibit PM
 * File:    js/main.js
 * Desc:    The "Conductor" module script. Hydrates data engines asynchronously 
 *          from local storage or file directories and launches the layout shell.
 **/

import layout from './components/layout.js';

$(document).ready(function() {
    console.clear();
    console.log("🚀 Module Conductor Script Online. Synchronizing Local Storage state...");

    // Initialize state mirror with data seeds if cache returns unpopulated
    initAppDataStore().then(() => {
        setupCentralEventListeners();
        
        console.log("🎨 Launching Primary Interface Shell Module...");
        // Execute the imported layout function file directly
        layout();
    });
});

/**
 * Validates sandboxed local data stores matching window.APP_CONFIG parameters.
 * Dynamically fetches text data from the new data/ directory if local store is clear.
 */
/**
 * Validates sandboxed local data stores matching window.APP_CONFIG parameters.
 * Strategically intercepts cache shadows during active development cycles.
 */
// js/main.js -> Update your initAppDataStore function:

function initAppDataStore() {
    return new Promise((resolve) => {
        const storageKey = `${window.APP_CONFIG.prefix}_DATA_STORE`;
        
        if (window.APP_CONFIG.devMode) {
            console.log("🛠️ DevMode Active: Clearing browser storage to pull clean, unified JSON lists...");
            localStorage.removeItem(storageKey);
        }

        const localCache = localStorage.getItem(storageKey);

        if (localCache) {
            const parsed = JSON.parse(localCache);
            window.DATA.collections.tasks = parsed.collections?.tasks || [];
            window.DATA.collections.resources = parsed.collections?.resources || [];
            window.DATA.collections.presentationContent = parsed.collections?.presentationContent || [];
            resolve();
        } else {
            console.warn("📥 Synchronizing app collections from unified data/ folder manifest...");

            // Execute single fetch targeting your complete new database manifest JSON
            fetch('data/initial_exhibit_data.json')
                .then(res => res.json())
                .then(jsonData => {
                    // Populate all arrays simultaneously into your single source of truth runtime mirror
                    window.DATA.collections.tasks = jsonData.workshopTasks || [];
                    window.DATA.collections.resources = jsonData.shoppingItems || [];
                    window.DATA.collections.presentationContent = jsonData.presentationContent || [];
                    
                    console.log("✅ All state collections loaded smoothly from JSON data manifest.");
                    localStorage.setItem(storageKey, JSON.stringify(window.DATA));
                    resolve();
                })
                .catch(err => {
                    console.error("🚨 Critical failure parsing data manifest file:", err);
                    window.DATA.collections.tasks = [];
                    window.DATA.collections.resources = [];
                    window.DATA.collections.presentationContent = [];
                    resolve();
                });
        }
    });
}



/**
 * Centralized Event Routing (Keeps view files unlinked from root layout)
 */
function setupCentralEventListeners() {
    $('#openSettings').on('click', () => $('#settingsModal').css('display', 'flex').hide().fadeIn(200));
    $('#closeSettings, .modal-overlay').on('click', function(e) {
        if (e.target === this || $(e.target).is('#closeSettings')) {
            $('#settingsModal').fadeOut(200);
        }
    });

    $("#saveButton").on("click", () => {
        if (typeof window.saveLocalToDb === "function") {
            window.saveLocalToDb().then(() => alert("✅ Backup saved to SQLite successfully."));
        }
    });
}

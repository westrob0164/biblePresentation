/**
 * Project: Bible Presentation Exhibit PM
 * File:    utilities/dbSync.js
 * Desc:    Manages LocalStorage <-> SQLite synchronization with namespacing.
 *          Refactored to cleanly align with the single DATA_STORE capsule model.
 **/

// 1. DYNAMIC PREFIX HELPER (Isolates your LocalStorage across unique project sandboxes)
const getPrefix = () => (window.APP_CONFIG && window.APP_CONFIG.prefix) ? window.APP_CONFIG.prefix + "_" : "APP_";

/**
 * STAGE 1: INITIALIZE
 * Loads your master JSON manifest file from /data/ directly into the unified LocalStorage cache
 */
async function initAppData() {
    const PREFIX = getPrefix();
    const storageKey = `${PREFIX}DATA_STORE`;

    try {
        // Fallback or explicit query check against your server file registries
        const response = await fetch('utilities/dataList.txt');
        if (!response.ok) throw new Error("Could not load utilities/dataList.txt");
        
        const text = await response.text();
        const fileNames = text.split(/\r?\n/).filter(name => name.trim() !== "");

        // If the main sandbox key doesn't exist on disk space yet, hydrate it instantly
        if (!localStorage.getItem(storageKey)) {
            console.warn(`📥 Cache clear for ${storageKey}. Syncing server data files...`);
            
            // Look up the master manifest folder path we created
            const targetFile = fileNames[0] || 'initial_exhibit_data';
            const res = await fetch(`data/${targetFile}.json`);
            
            if (res.ok) {
                const jsonData = await res.json();
                
                // Package the incoming raw array inputs directly into your window.DATA shape
                const initialPayloadStore = {
                    collections: {
                        tasks: jsonData.workshopTasks || [],
                        resources: jsonData.shoppingItems || [],
                        presentationContent: jsonData.presentationContent || []
                    },
                    activeId: null,
                    activePanelFilter: "all"
                };

                localStorage.setItem(storageKey, JSON.stringify(initialPayloadStore));
                console.log(`✅ LocalStorage successfully initialized capsule: ${storageKey}`);
            } else {
                console.error(`🚨 Backup sync failure: data/${targetFile}.json is missing from server.`);
            }
        }
        console.log(`✅ LocalStorage successfully verified for prefix: ${PREFIX}`);
    } catch (err) {
        console.error("❌ App initialization engine loop failed:", err);
    }
}

/**
 * STAGE 2: SAVE
 * Sends the unified project data mirror capsule to SQLite via save_to_db.php
 */
async function saveLocalToDb() {
    const PREFIX = getPrefix();
    const storageData = {};

    // Gather your explicit prefix sandboxed keys into the post payload bundle
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(PREFIX)) {
            storageData[key] = localStorage.getItem(key);
        }
    });

    try {
        const response = await fetch('save_to_db.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(storageData)
        });

        if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);

        const result = await response.json();
        console.log("💾 SQLite Backup Synced successfully:", result.message || "OK");
        return result;
    } catch (err) {
        console.error("❌ Save to SQLite server failed:", err);
        throw err;
    }
}

/**
 * STAGE 3: AUTOMATED BACKGROUND SYNC TRIGGER
 * Called silently by components on drag or toggle states to auto-save in the background
 */
let syncDebounceTimeout = null;
function triggerAutomatedDbSync() {
    // If auto-saves are disabled in config profiles, kill execution immediately
    if (window.APP_CONFIG.saveInterval === 0) return;

    // Clear old timeout to implement high-performance debouncing
    clearTimeout(syncDebounceTimeout);
    
    // Debounce the call to avoid slamming the PHP server with multiple rapid queries
    syncDebounceTimeout = setTimeout(() => {
        console.log("⏳ Running automated background SQLite database sync save...");
        saveLocalToDb().catch(() => console.warn("Background auto-save failed. Will retry next action."));
    }, 2000); // Wait 2 seconds after the user stops dragging/clicking before executing
}

/**
 * STAGE 4: RESTORE
 * Pulls data from SQLite and overwrites LocalStorage
 */
async function restoreLocalFromDb() {
    try {
        const response = await fetch('read_db.php');
        if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
        
        const dbData = await response.json();

        // Loop through incoming keys and re-commit them to the user's hard drive space
        Object.entries(dbData).forEach(([key, value]) => {
            const storageValue = (typeof value === 'object') ? JSON.stringify(value) : value;
            localStorage.setItem(key, storageValue);
        });

        console.log("✅ LocalStorage successfully restored from SQLite file.");
        location.reload(); // Refresh viewport screen to populate changes
    } catch (err) {
        console.error("❌ Restore database operation failed:", err);
    }
}

/**
 * HELPER: GETTER
 * Pulls down clean lookup segments from memory storage
 */
function getLocalData(key) {
    const PREFIX = getPrefix();
    const data = localStorage.getItem(PREFIX + key);
    try {
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return data;
    }
}

// Global Registry Mapping (Links script hooks explicitly to window global execution layers)
window.initAppData = initAppData;
window.saveLocalToDb = saveLocalToDb;
window.restoreLocalFromDb = restoreLocalFromDb;
window.getLocalData = getLocalData;
window.triggerAutomatedDbSync = triggerAutomatedDbSync; // Hooked into Kanban board and checklist files

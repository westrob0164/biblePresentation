// utilities/config.js

window.APP_CONFIG = {
    projectName: "Bible-Exhibit-PM",
    prefix: "EXHIBIT_PM_V1", 
    version: "1.0.4",
    saveInterval: 5000,
    devMode: true, // Overwrites cache during active coding

    panels: [
        { id: 0, title: "📦 General Infrastructure", short: "General" },
        { id: 1, title: "📜 Panel 1: The Ancient Scribe", short: "Panel 1" },
        { id: 2, title: "🏺 Panel 2: Earth & Archaeology", short: "Panel 2" },
        { id: 3, title: "⏳ Panel 3: The Sieve of History", short: "Panel 3" },
        { id: 4, title: "📖 Panel 4: Passing the Torch", short: "Panel 4" },
        { id: 5, title: "🇬🇧 Panel 5: Manuscripts to the KJV", short: "Panel 5" }
    ],
    statuses: {
        TO_ORDER: 'to_order',
        TO_BUILD: 'to_build',
        IN_PROGRESS: 'in_progress',
        COMPLETED: 'completed'
    },
    statusUi: {
        to_order: { label: '🛒 To Order', color: '#e67e22' },
        to_build: { label: '📐 To Build', color: '#2980b9' },
        in_progress: { label: '⏳ In Progress', color: '#f1c40f' },
        completed: { label: '✅ Completed', color: '#2ecc71' }
    }
};

window.DATA = {
    collections: {
        tasks: [],
        resources: [],
        presentationContent: [] 
    }, 
    activeId: null,
    activePanelFilter: "all" 
};

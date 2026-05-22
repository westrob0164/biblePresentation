/**
 * Project: Bible Presentation Exhibit PM
 * File:    js/components/presentationView.js
 * Desc:    Renders public exhibit summaries and scroll data instructions
 *          by pulling records dynamically out of the synchronized database collections.
 **/

export default function presentationView($canvas) {
    $canvas.empty();

    const $splitView = window.dom.create('exhibit-split-view', $canvas, { style: 'display: flex; gap: 30px;' });
    
    const $sidebar = window.dom.create('exhibit-sidebar', $splitView, { tag: 'nav' });
    window.dom.create('sidebar-title', $sidebar, { tag: 'h3', text: 'SELECT EXHIBIT BOARD:' });
    const $buttonList = window.dom.create('nav-list', $sidebar);
    
    const $contentArea = window.dom.create('exhibit-content-portal', $splitView);

    // Dynamically iterate over your panels array loaded via config profiles
    window.APP_CONFIG.panels.forEach(panel => {
        const $btn = window.dom.create('panel-nav-item', $buttonList, {
            tag: 'button', text: panel.title
        });

        $btn.on('click', () => {
            $buttonList.find('.panel-nav-item').css({ 'background': '#f8fafc', 'color': '#2c3e50' });
            $btn.css({ 'background': '#2c3e50', 'color': 'white' });
            window.DATA.activePanelFilter = panel.id;
            
            // Execute sub-render search using active filter ids
            renderPortalDetails($contentArea, panel.id);
        });

        if (window.DATA.activePanelFilter === panel.id || (window.DATA.activePanelFilter === 'all' && panel.id === 0)) {
            $btn.trigger('click');
        }
    });
}

/**
 * Searches the synchronized collection matching selected array indexes.
 * Fits 'One File, One Function' sub-component architecture rules.
 */
function renderPortalDetails($container, panelId) {
    $container.empty();

    // Scan window.DATA for the matching content record pulled from your SQLite engine
    const contentRecord = window.DATA.collections.presentationContent.find(item => item.panelId === panelId);

    if (!contentRecord) {
        window.dom.create('error-desc', $container, {
            tag: 'p',
            text: 'Historical research text configurations for this panel section are currently unhydrated or empty.'
        });
        return;
    }

    // Print the database values onto the screen dynamically
    window.dom.create('portal-header', $container, { tag: 'h2', text: contentRecord.headline });
    const $infoBody = window.dom.create('portal-body', $container, { tag: 'div' });
    
    window.dom.create('desc', $infoBody, { tag: 'p', html: contentRecord.body });

    // If the database record contains custom bullet arrays, print them as structural list nodes
    if (contentRecord.bullets && contentRecord.bullets.length > 0) {
        const $list = window.dom.create('history-list', $infoBody, { tag: 'ul' });
        contentRecord.bullets.forEach((bulletText, index) => {
            window.dom.create(`bullet-${index}`, $list, { tag: 'li', html: bulletText });
        });
    }
}

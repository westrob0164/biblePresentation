/**
 * Project: Bible Presentation Exhibit PM
 * File:    js/components/layout.js
 * Desc:    Implements the layout shell element. Builds the header chassis bar
 *          and maps click actions across five distinct modular display views.
 **/

import workshopView from './workshopView.js';
import presentationView from './presentationView.js';
import shoppingList from './shoppingList.js';
import detailVault from './detailVault.js';
import signageVault from './signageVault.js'; // Linked for printable card downloads

export default function layout() {
    $('#app').empty();

    // 1. Structural Header Frame Construction
    const $header = window.dom.create('exhibit-header', '#app', { tag: 'header' });

    const $titleBlock = window.dom.create('title-group', $header);
    window.dom.create('main-title', $titleBlock, { tag: 'h1', text: '🏛️ BIBLE EXHIBIT PORTAL' });
    window.dom.create('sub-title', $titleBlock, {
        tag: 'small',
        text: `Project: ${window.APP_CONFIG.projectName} [v${window.APP_CONFIG.version}]`
    });

    // 2. Viewport Navigation Control Group Configuration (Holds all 5 buttons)
    const $navButtonGroup = window.dom.create('nav-group', $header);
    
    const $workshopBtn = window.dom.create('nav-btn', $navButtonGroup, { tag: 'button', text: '🛠️ Workshop Dashboard' });
    const $presentationBtn = window.dom.create('nav-btn', $navButtonGroup, { tag: 'button', text: '📖 Public Presentation View' });
    const $shoppingBtn = window.dom.create('nav-btn', $navButtonGroup, { tag: 'button', text: '🛒 Sourcing Checklist' });
    const $vaultBtn = window.dom.create('nav-btn', $navButtonGroup, { tag: 'button', text: '📥 Detailed PDF Blueprints' });
    const $signageBtn = window.dom.create('nav-btn', $navButtonGroup, { tag: 'button', text: '🏷️ Printable Table Signage' });

    // 3. Central Canvas Base Plate Anchor Layout Frame
    const $workspaceCanvas = window.dom.create('workspace-canvas', '#app', { tag: 'main', id: 'workspace-canvas' });

    const resetNavigationStyles = () => {
        $navButtonGroup.find('.nav-btn').css('background', '#34495e');
    };

    // 4. Input Action Routing System Mapping Event Listeners
    $workshopBtn.on('click', () => { resetNavigationStyles(); $workshopBtn.css('background', '#3498db'); workshopView($workspaceCanvas); });
    $presentationBtn.on('click', () => { resetNavigationStyles(); $presentationBtn.css('background', '#3498db'); presentationView($workspaceCanvas); });
    $shoppingBtn.on('click', () => { resetNavigationStyles(); $shoppingBtn.css('background', '#3498db'); shoppingList($workspaceCanvas); });
    $vaultBtn.on('click', () => { resetNavigationStyles(); $vaultBtn.css('background', '#3498db'); detailVault($workspaceCanvas); });
    
    $signageBtn.on('click', () => { 
        resetNavigationStyles(); 
        $signageBtn.css('background', '#3498db'); 
        signageVault($workspaceCanvas); 
    });

    // Run primary active view default on startup: Workshop board tasks tracking grid
    $workshopBtn.css('background', '#3498db');
    workshopView($workspaceCanvas);
}

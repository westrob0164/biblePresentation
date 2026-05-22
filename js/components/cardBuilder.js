/**
 * Project: Bible Presentation Exhibit PM
 * File:    js/components/cardBuilder.js
 * Desc:    Modular component file creating a single data-driven task card element.
 *          Enforces jQuery UI Draggable actions for Kanban column movement.
 **/

// Local configuration array mapping unique colors to each specific project panel
const PANEL_COLORS = {
    0: { label: 'General Frame', color: '#7f8c8d' }, // Neutral Slate Gray
    1: { label: 'Panel 1: Scribe', color: '#8e44ad' }, // Royal Purple
    2: { label: 'Panel 2: Archae.', color: '#d35400' }, // Terracotta Orange
    3: { label: 'Panel 3: Sieve', color: '#16a085' }, // Teal Green
    4: { label: 'Panel 4: Scroll', color: '#27ae60' }, // Emerald Green
    5: { label: 'Panel 5: KJV Line', color: '#c0392b' } // Crimson Red
};

/**
 * Builds a single task card inside a targeted lane element list.
 * Case-sensitive default export matches filename exactly per standards blueprint rules.
 * @param {jQuery} $appendTo The target column list jQuery element container.
 * @param {Object} task The specific task record object retrieved from window.DATA.
 */
export default function cardBuilder($appendTo, task) {
    
    // 1. Build the foundational task card shell element wrapper
    const $card = window.dom.create('task-card', $appendTo, {
        tag: 'article',
        id: task.id
    });

    // Extract color parameters based on the task panel association ID
    const panelMeta = PANEL_COLORS[task.panelId] || { label: 'Unknown', color: '#bdc3c7' };

    // Apply the specific panel edge border accent to the card frame dynamically
    $card.css('border-left-color', panelMeta.color);

    // 2. Inject the colored Panel Tag Badge element
    window.dom.create('panel-tag-badge', $card, {
        tag: 'span',
        text: panelMeta.label,
        style: `background-color: ${panelMeta.color};`
    });

    // 3. Inject the Task Title Name text node
    window.dom.create('task-card-title', $card, {
        tag: 'h4',
        text: task.name
    });

    // 4. Inject your spatial quadrant blueprint layout notes if text exists
    if (task.notes && task.notes.trim() !== "") {
        window.dom.create('task-blueprint-notes', $card, {
            tag: 'p',
            html: `<strong>Blueprint:</strong> ${task.notes}`
        });
    }

    // 5. Activate drag mechanics using your loaded jQuery UI library tools
        // 5. Activate drag mechanics using your loaded jQuery UI library tools
    $card.draggable({
        revert: 'invalid',      // Snaps card cleanly back into its column if dropped outside a lane list
        containment: '#workspace-canvas', // Stop cards from being accidentally dragged off the web screen
        cursor: 'move',
        zIndex: 1000,
        
        // 🚀 THE FIX: Use a custom helper function to capture and freeze the card's width
        helper: function() {
            // Clone the original task card element
            const $clone = $(this).clone();
            
            // Get the exact physical pixel width of the lane column right now
            const currentWidth = $(this).outerWidth();
            
            // Explicitly force the clone to retain this exact width while floating in the air
            $clone.css({
                'width': currentWidth + 'px',
                'box-sizing': 'border-box'
            });
            
            return $clone;
        },
        
        start: function() {
            // Keep track of the item currently in flight inside the global state mirror
            window.DATA.activeId = task.id;
            $(this).css('opacity', '0.2'); // Fade the original element slightly during transit
        },
        stop: function() {
            window.DATA.activeId = null;
            $(this).css('opacity', '1.0'); // Instantly restore card opacity on release
        }
    });

}


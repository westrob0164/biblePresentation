/**
 * Project: Bible Presentation Exhibit PM
 * File:    js/components/workshopView.js
 * Desc:    Modular component compiling a full-width, 4-column interactive 
 *          Kanban board layout powered by jQuery UI drop targets.
 **/

import cardBuilder from './cardBuilder.js';

/**
 * Renders the master production grid across the full canvas area.
 * Case-sensitive default export matches filename exactly per standards blueprint.
 * @param {jQuery} $canvas Primary workspace insertion container element.
 */
export default function workshopView($canvas) {
    $canvas.empty();

    // 1. Construct the overarching full-width Flex Board frame wrapper
    const $board = window.dom.create('kanban-board', $canvas);

    // 2. Extract configuration parameters to build out lanes dynamically
    const statuses = window.APP_CONFIG.statuses;     // { TO_ORDER: 'to_order', ... }
    const statusUi = window.APP_CONFIG.statusUi;     // { to_order: { label: '...', color: '...' }, ... }

    // Map each status into a distinct equal-width layout lane
    Object.keys(statuses).forEach(key => {
        const statusCode = statuses[key]; // e.g., 'to_order'
        const uiConfig = statusUi[statusCode];

        // Create the individual lane column
        const $lane = window.dom.create('kanban-lane', $board, {
            tag: 'section',
            id: `lane_${statusCode}`
        });

        // Inject Column Header Title
        window.dom.create('lane-header', $lane, {
            tag: 'h3',
            text: uiConfig.label
        });

        // Set the custom header accent border color based on configuration profile
        $lane.find('h3').css('border-bottom-color', uiConfig.color);

        // Create the drop-target list container box inside the lane column
        const $taskListContainer = window.dom.create('lane-task-list', $lane, {
            id: `list_${statusCode}`,
            data: { status: statusCode }
        });

        // 3. Populate Task Cards matching this active status lane
        // Filters through the window.DATA state array cleanly
        const laneTasks = window.DATA.collections.tasks.filter(task => task.status === statusCode);

        laneTasks.forEach(task => {
            // Execute card component renderer subroutine
            cardBuilder($taskListContainer, task);
        });

        // 4. Activate Interactive Drag-and-Drop Pipelines via jQuery UI Droppable
        $taskListContainer.droppable({
            accept: '.task-card', // Only allow structural task components to be dropped here
            hoverClass: 'lane-hover', // Triggers our background glow layout style on hover
            drop: function(event, ui) {
                const $droppedCard = ui.draggable;
                const taskId = $droppedCard.attr('id'); // e.g., "task_1716382..."
                const targetStatus = $(this).attr('data-status'); // e.g., "in_progress"

                // State Mutation Strategy: Locate task inside source of truth array
                const taskMatch = window.DATA.collections.tasks.find(t => t.id === taskId);
                
                if (taskMatch && taskMatch.status !== targetStatus) {
                    console.log(`🔄 Shuffling task [${taskMatch.name}] -> ${targetStatus.toUpperCase()}`);
                    
                    // Mutate runtime memory variable
                    taskMatch.status = targetStatus;
                    taskMatch.updatedAt = new Date().toISOString();

                    // Snap card element visually directly into its new DOM parent container list
                    $droppedCard.appendTo($(this)).css({
                        top: '0px',
                        left: '0px'
                    });

                    // Commit changes to local disk cache storage
                    const storageKey = `${window.APP_CONFIG.prefix}_DATA_STORE`;
                    localStorage.setItem(storageKey, JSON.stringify(window.DATA));

                    // Trigger automated PHP database background background save if tool script exists
                    if (typeof window.triggerAutomatedDbSync === "function") {
                        window.triggerAutomatedDbSync();
                    }
                }
            }
        });
    });
}

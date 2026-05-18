/**

* Project: [NEW PROJECT NAME]
* File: cardBuilder.js
* Desc: Sample UI Component Blueprint.
* Demonstrates One File One Function, dom.create, and dom.date.
**/

export default function cardBuilder(appendToContainer, projectData = {}) {
// 1. Extract individual properties from your database object payload
    const projectId = projectData.id || "unknown";
    const projectName = projectData.name || "Untitled Project";
    const rawDateToken = projectData.dateToken || "DATE_20260518";

    // 2. Compute a human-readable calendar label using your global dom.date helper
    // No imports needed! This reads right from your utilities/dom.js engine
    const calendarArray = dom.date.createDateTitle(rawDateToken);
    const humanReadableDate = calendarArray[0];

    // 3. Construct the outer wrapper box using your universal dom.create engine
    const $card = dom.create("ui-project-card", appendToContainer, {
        id: "card_" + projectId,
        style: "border: 1px solid #ccc; padding: 15px; margin: 10px; border-radius: 5px; background: #fff;"
    });

    // 4. Inject the Project Title Heading
    dom.create("card-title", $card, {
        tag: "h4",
        text: projectName,
        style: "margin: 0 0 5px 0; color: #333;"
    });

    // 5. Inject the Calculated Calendar Date Label
    dom.create("card-date-label", $card, {
        tag: "small",
        text: "Created: " + humanReadableDate,
        style: "color: #666; display: block; margin-bottom: 15px;"
    });
    
    // 6. Inject an Action Button with an inline operational click event
    dom.create("card-action-btn", $card, {
        tag: "button",
        text: "Complete Project",
        style: "background: #007bff; color: white; border: none; padding: 5px 10px; cursor: pointer;",
    on: {
        click: function() {
                alert("Action triggered for project ID: " + projectId);
                // Example of updating your global state tree
                if (window.DATA && window.DATA.collections) {
                    window.DATA.activeId = projectId;
                }
                // Toggle a visual feedback style instantly using standard jQuery
                $card.css("opacity", "0.5");
            }
        }
    });
    return $card;
}


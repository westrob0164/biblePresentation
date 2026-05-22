/**
 * Project: Bible Presentation Exhibit PM
 * File:    js/components/shoppingList.js
 * Desc:    Modular component file compiling the material procurement checklist,
 *          calculating running project costs, and managing checkbox status mutations.
 **/

// Explicit local color lookup map matching cardBuilder panel badges exactly
const BADGE_CONFIG = {
    0: { label: 'General', color: '#7f8c8d' },
    1: { label: 'Panel 1', color: '#8e44ad' },
    2: { label: 'Panel 2', color: '#d35400' },
    3: { label: 'Panel 3', color: '#16a085' },
    4: { label: 'Panel 4', color: '#27ae60' },
    5: { label: 'Panel 5', color: '#c0392b' }
};

/**
 * Compiles your material purchasing checklist matrix.
 * Case-sensitive name mapping matches filename exactly per requirements.
 * @param {jQuery} $canvas Target primary workspace container view.
 */
export default function shoppingList($canvas) {
    $canvas.empty();

    // 1. Render Section Headers
    window.dom.create('shopping-title', $canvas, {
        tag: 'h2',
        text: '🛒 MATERIAL PROCUREMENT & SOURCING CHECKLIST'
    });

    window.dom.create('shopping-desc', $canvas, {
        tag: 'p',
        text: 'Track specialty orders and local lumber hardware pickups here. Checking an item off instantly mutates your active runtime memory store and updates your running budget calculations in real-time.',
        style: 'margin: 0 0 20px 0; color: #64748b; font-size: 14px;'
    });

    const $container = window.dom.create('shopping-container', $canvas);

    // 2. Build Budget Summary Metrics Cards Component Pane
    const $budgetStrip = window.dom.create('budget-summary-strip', $container);
    const $totalCard = window.dom.create('budget-card', $budgetStrip, { id: 'budget_total_box' });
    const $remainingCard = window.dom.create('budget-card', $budgetStrip, { id: 'budget_remain_box', style: 'border-left-color: #e67e22;' });

    // 3. Compile Master Table Grid Scaffold
    const $table = window.dom.create('shopping-table', $container, { tag: 'table' });
    const $thead = window.dom.create('table-head', $table, { tag: 'thead' });
    const $headerRow = window.dom.create('header-row', $thead, { tag: 'tr' });
    
    // Inject column definitions
    ['Status', 'Material Name', 'Target Scope', 'Vendor Source', 'Est. Cost'].forEach(headerText => {
        window.dom.create('th-cell', $headerRow, { tag: 'th', text: headerText });
    });

    const $tbody = window.dom.create('table-body', $table, { tag: 'tbody' });

    /**
     * Internal encapsulation function to recalculate running costs dynamically.
     * Fits clean functional isolation paradigms.
     */
    const recalculateProjectCosts = () => {
        let grandTotal = 0;
        let remainingCost = 0;

        window.DATA.collections.resources.forEach(item => {
            grandTotal += item.cost;
            if (!item.isOrdered) {
                remainingCost += item.cost;
            }
        });

        // Reprint values cleanly inside top cards
        $totalCard.empty();
        window.dom.create('h-t', $totalCard, { tag: 'h5', text: 'Total Projected Cost' });
        window.dom.create('v-t', $totalCard, { tag: 'span', text: `$${grandTotal.toFixed(2)}` });

        $remainingCard.empty();
        window.dom.create('h-r', $remainingCard, { tag: 'h5', text: 'Remaining Purchasing Backlog' });
        window.dom.create('v-r', $remainingCard, { tag: 'span', text: `$${remainingCost.toFixed(2)}` });
    };

    // 4. Populate Resource Checklist Rows from your window.DATA source of truth
    window.DATA.collections.resources.forEach((item, index) => {
        const $row = window.dom.create('shopping-row', $tbody, { tag: 'tr', id: `row_${item.id}` });
        const panelMeta = BADGE_CONFIG[item.panelId] || { label: 'General', color: '#7f8c8d' };

        // Column 1: Interactive Checkbox
        const $checkCell = window.dom.create('td-cell', $row, { tag: 'td', style: 'width: 50px; text-align: center;' });
        const $checkbox = window.dom.create('procure-checkbox', $checkCell, {
            tag: 'input',
            attr: { type: 'checkbox' }
        });
        $checkbox.prop('checked', item.isOrdered);

        // Column 2: Material Name 
        const $nameCell = window.dom.create('td-cell', $row, { tag: 'td', text: item.name, style: 'font-weight: 600;' });

        // Column 3: Target Panel Scope Label Badge
        const $scopeCell = window.dom.create('td-cell', $row, { tag: 'td' });
        window.dom.create('panel-tag-badge', $scopeCell, {
            tag: 'span',
            text: panelMeta.label,
            style: `background-color: ${panelMeta.color}; margin: 0; font-size: 10px;`
        });

        // Column 4: Vendor Sourcing Route Link
        const $vendorCell = window.dom.create('td-cell', $row, { tag: 'td' });
        if (item.url && item.url.trim() !== "") {
            window.dom.create('vendor-link', $vendorCell, {
                tag: 'a',
                text: item.source,
                attr: { href: item.url, target: '_blank' }
            });
        } else {
            window.dom.create('vendor-text', $vendorCell, { tag: 'span', text: item.source });
        }

        // Column 5: Cost Currency Metric
        window.dom.create('td-cell', $row, { tag: 'td', text: `$${item.cost.toFixed(2)}`, style: 'font-weight: bold; width: 100px;' });

        // Apply a visual dimming class right away if local database record tracks item as ordered
        if (item.isOrdered) {
            $row.addClass('row-ordered');
        }

        // 5. Checkbox Change Mutation Event Handler
        $checkbox.on('change', function() {
            const isChecked = $(this).is(':checked');
            
            // State Mutation Strategy: Locate and flip value in core data schema array
            item.isOrdered = isChecked;
            
            // Apply or remove visual strike-through dimming rows layout styles
            if (isChecked) {
                $row.addClass('row-ordered');
            } else {
                $row.removeClass('row-ordered');
            }

            // Commit data bundle updates instantly down to disk space cache
            const storageKey = `${window.APP_CONFIG.prefix}_DATA_STORE`;
            localStorage.setItem(storageKey, JSON.stringify(window.DATA));

            // Run budget calculations recalculation loop
            recalculateProjectCosts();

            // Trigger automated dbSync routine if background sync is wired
            if (typeof window.triggerAutomatedDbSync === "function") {
                window.triggerAutomatedDbSync();
            }
        });
    });

    // Run initial budget totals tally on application view instantiation
    recalculateProjectCosts();
}

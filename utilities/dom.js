/**
 * Project: [NEW PROJECT NAME]
 * File:    dom.js
 * Desc:    Master DOM element construction engine with global date utilities.
 **/

if (window.jQuery && !window.jQuery.uniqueSort) {
    window.jQuery.uniqueSort = window.jQuery.unique;
}

if (window.jQuery && $.cssNumber) {
    $.cssNumber.gridColumnStart = true;
}

window.dom = {
    /**
     * Highly optimized universal element builder.
     * Usage: dom.create("class-name", "#parent-id", { tag: "div", html: "content" })
     */
    create(className, appendTo, options = {}) {
        const tagName = options.tag || "div";
        const $el = $(`<${tagName}>`).addClass(className);

        if (options.html) $el.html(options.html);
        if (options.text) $el.text(options.text);
        if (options.id)   $el.attr('id', options.id);
        
        if (options.attr) {
            Object.entries(options.attr).forEach(([key, val]) => {
                $el.attr(key, val);
            });
        }
        
        if (options.style) {
            $el[0].setAttribute('style', options.style); 
        }
        
        if (options.data) {
            Object.entries(options.data).forEach(([key, val]) => {
                $el.attr(`data-${key}`, val);
            });
        }

        if (options.on) {
            Object.entries(options.on).forEach(([eventName, handler]) => {
                $el.on(eventName, handler);
            });
        }

        return appendTo ? $el.appendTo(appendTo) : $el;
    },

    // ------------------------------------------------------------------------
    // Standard creation pattern
    // ------------------------------------------------------------------------
    // Use dom.create() for all new DOM construction.
    // Example:
    //   dom.create('card', '#app', {
    //     tag: 'article',
    //     id: 'taskCard',
    //     html: '<h3>Task</h3>',
    //     data: { id: 123 },
    //     on: { click: () => console.log('clicked') }
    //   });
    //
    // The create() method covers the previous helpers by supporting:
    //   - tag, id, class, html, text
    //   - attr, data, style, event handlers
    //   - native append target via selector or element

    /**
     * 🚀 UNIFIED DATE ENGINE
     * Single source of truth for all date operations
     * 
     * METHODS:
     *   Formatting:
     *     - dom.date.toYYYYMMDD(date) → "20260521"
     *     - dom.date.toYYYY_MM_DD(date) → "2026-05-21"
     *     - dom.date.createDateTitle(dateID) → "Sunday May 21st, 2026"
     * 
     *   Parsing:
     *     - dom.date.parseID(dateID) → { year, month, day, date }
     *     - dom.date.deconstructDateID(dateID) → [dateSunday, year, month, day, ...]
     *     - dom.date.getDateInfo(dateID) → [monthName, dayNames, dayNumberArray, ...]
     * 
     *   Calendar:
     *     - dom.date.firstDay(year, month)
     *     - dom.date.dayInMonth(year, month)
     *     - dom.date.getWeekNumber(year, month, day)
     *     - dom.date.ordinalSuffix(n) → "st", "nd", "rd", "th"
     */
    date: window.DateObject ? new window.DateObject() : null
};





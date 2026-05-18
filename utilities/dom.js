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

    // 🚀 THE GLOBAL ATTACHMENT
    // Automatically binds your date calculations engine here
    date: window.DateObject ? new window.DateObject() : null
};




////////////////////////////////**********  Function Call - RETAINED FOR REFERENCE  **********/
dom.create("search-input", "#formContainer", {
    tag: "input",
    attr: { type: "text", placeholder: "Search records..." },
    style: "grid-column-start: 2; color: #333;",
    on: {
        input: function() { console.log($(this).val()); }
    }
});

/**  */
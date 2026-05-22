/**
 * Project: [NEW PROJECT NAME]
 * File:    dateClass.js
 * Desc:    Unified calendar and date transformation engine.
 *          Single source of truth for all date operations.
 **/

class DateObject { 
    constructor() {
        this.monthNames    = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.monthNamesAbb = ["Jan.","Feb.","Mar.","Apr.","May","June","Jul.","Aug.","Sept.","Oct.", "Nov.","Dec."];
        this.dayNames      = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.dayNamesAbb   = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];       
    }

    // ========================================================================
    // CALENDAR UTILITIES
    // ========================================================================

    firstDay(year, month) { 
        return (new Date(year, month)).getDay();  
    }

    dayInMonth(year, month) { 
        return (new Date(year, month + 1, 0)).getDate();  
    }

    getWeekNumber(year, month, day) {
        const d = new Date(Date.UTC(year, month - 1, day));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    ordinalSuffix(n) {
        return ["st","nd","rd"][((n+90)%100-10)%10-1] || "th";
    }

    // Backwards compatibility: old typo spelling
    oridinalSuffix(n) {
        return this.ordinalSuffix(n);
    }

    // ========================================================================
    // DATE FORMATTING - Convert Date objects to standardized strings
    // ========================================================================

    /**
     * Format Date to YYYYMMDD (e.g., 20260521)
     * @param {Date} date - JavaScript Date object
     * @returns {string} - Formatted date string
     */
    toYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    /**
     * Format Date to YYYY-MM-DD (e.g., 2026-05-21)
     * @param {Date} date - JavaScript Date object
     * @returns {string} - Formatted date string
     */
    toYYYY_MM_DD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // ========================================================================
    // DATE PARSING - Deconstruct date ID tags into structured data
    // ========================================================================

    /**
     * Parse custom date ID format (e.g., "DATE_20260521")
     * @param {string} dateID - Custom date ID tag
     * @returns {object} - Structured date information
     */
    parseID(dateID) {
        const yearPart = dateID.substring(5, 9);
        const monthPart = dateID.substring(9, 11);
        const dayPart = dateID.substring(11, 13);

        return {
            year: parseInt(yearPart),
            month: parseInt(monthPart),
            day: parseInt(dayPart),
            date: new Date(parseInt(yearPart), parseInt(monthPart) - 1, parseInt(dayPart))
        };
    }

    /**
     * Deconstruct date ID and return comprehensive structural arrays
     * Returns: [dateSunday, year, month, day, daysPrevMonth, daysThisMonth, daysNextMonth, weekNumber]
     * @param {string} dateID - Custom date ID tag
     */
    deconstructDateID(dateID) {
        const parsed = this.parseID(dateID);
        const { year, month, day } = parsed;
        const deconDate = new Date(year, month - 1, day);
        const weekDayNumber = deconDate.getDay();

        const weekNumber = this.getWeekNumber(year, month, day);

        // Days in surrounding months
        const daysPrevMonth = this.dayInMonth(year, month - 2);
        const daysThisMonth = this.dayInMonth(year, month - 1);
        const daysNextMonth = this.dayInMonth(year, month);

        const dateSunday = day - weekDayNumber;
        
        return [dateSunday, year, month, day, daysPrevMonth, daysThisMonth, daysNextMonth, weekNumber];
    }

    /**
     * Get comprehensive date information for calendar/UI rendering
     * @param {string} dateID - Custom date ID tag
     * @returns {array} - [monthName, dayNames, dayNumberArray, dateNumberArray, ordinal]
     */
    getDateInfo(dateID) {
        const dateNumberArray = this.deconstructDateID(dateID);
        
        // Safely clamp indices to prevent out-of-bounds access
        const monthIndex = Math.max(0, Math.min(11, parseInt(dateNumberArray[2]) - 1));
        const monthNamePre = this.monthNames[Math.max(0, monthIndex - 1)];
        const monthNameCurr = this.monthNames[monthIndex];
        const monthNameNext = this.monthNames[Math.min(11, monthIndex + 1)];

        const dayNames = this.dayNames;
        const dayNumberArray = [];
        let monthType = 0;  // Changed to number for consistent switch comparison

        for (let i = 0; i < 7; i++) {
            const date = i + dateNumberArray[0];
            let dateNumberLabel;

            if (date < 1) {
                dateNumberLabel = dateNumberArray[4] + date;
                monthType = 1;
            } else if (date > dateNumberArray[5]) {
                dateNumberLabel = date - dateNumberArray[5];
                monthType = 2;
            } else {
                dateNumberLabel = date;
            }
            dayNumberArray.push(dateNumberLabel);
        }

        let monthName;
        switch (monthType) {
            case 0:
                monthName = monthNameCurr;
                break;
            case 1:
                monthName = `${monthNamePre} - ${monthNameCurr}`;
                break;
            case 2:
                monthName = `${monthNameCurr} - ${monthNameNext}`;
                break;
            default:
                monthName = monthNameCurr;
        }

        const ordinal = `${dayNumberArray[0]}${this.ordinalSuffix(dayNumberArray[0])}`;

        return [monthName, dayNames, dayNumberArray, dateNumberArray, ordinal];
    }

    /**
     * Create human-readable date title from date ID
     * Format: "Sunday January 5th, 2026"
     * @param {string} dateID - Custom date ID or YYYY-MM-DD format
     * @returns {string} - Formatted date title
     */
    createDateTitle(dateID) {
        let dateInfo;
        
        // Handle both "DATE_YYYYMMDD" and "YYYY-MM-DD" formats
        if (dateID.includes('-')) {
            dateInfo = dateID.split('-');
        } else {
            const parsed = this.parseID(dateID);
            dateInfo = [parsed.year, String(parsed.month).padStart(2, '0'), String(parsed.day).padStart(2, '0')];
        }

        const monthName = this.monthNames[parseInt(dateInfo[1]) - 1];
        const ordinalDayTitle = this.ordinalSuffix(parseInt(dateInfo[2]));

        return `${this.dayNames[new Date(dateInfo[0], dateInfo[1] - 1, dateInfo[2]).getDay()]} ${monthName} ${parseInt(dateInfo[2])}${ordinalDayTitle}, ${dateInfo[0]}`;
    }
    
        /**
     * Calculates the total bounding date strings for a Sunday-to-Saturday sequence.
     * @param {string|Date} referenceDate - Baseline date string (YYYY-MM-DD) or object
     * @returns {Array<string>} Exact array list of 7 consecutive 'YYYY-MM-DD' dates
     */
    getWeekGrid(referenceDate = new Date()) {
        const base = referenceDate instanceof Date ? referenceDate : new Date(referenceDate + "T00:00:00");
        
        // Find Sunday by subtracting the current weekday index (0 = Sun, 1 = Mon, etc.)
        const currentDayIndex = base.getDay();
        const sundayAnchor = new Date(base);
        sundayAnchor.setDate(base.getDate() - currentDayIndex);

        const datesGrid = [];
        for (let i = 0; i < 7; i++) {
            const stepDay = new Date(sundayAnchor);
            stepDay.setDate(sundayAnchor.getDate() + i);
            
            // Format directly into standard YYYY-MM-DD
            const yyyy = stepDay.getFullYear();
            const mm = String(stepDay.getMonth() + 1).padStart(2, '0');
            const dd = String(stepDay.getDate()).padStart(2, '0');
            
            datesGrid.push(`${yyyy}-${mm}-${dd}`);
        }
        return datesGrid;
    }




}

window.DateObject = DateObject;
// export default DateObject;

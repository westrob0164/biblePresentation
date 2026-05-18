/**
 * Project: [NEW PROJECT NAME]
 * File:    dateClass.js
 * Desc:    Calendar and structural date transformation calculator.
 **/

class DateObject { 
    constructor() {
        this.monthNames    = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.monthNamesAbb = ["Jan.","Feb.","Mar.","Apr.","May","June","Jul.","Aug.","Sept.","Oct.", "Nov.","Dec."];
        this.dayNames      = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.dayNamesAbb   = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];       
    }

    firstDay(year, month) { 
        return (new Date(year, month)).getDay();  
    }

    dayInMonth(year, month) { 
        return (new Date(year, month + 1, 0)).getDate();  
    }

    oridinalSuffix(n) {
        return ["st","nd","rd"][((n+90)%100-10)%10-1] || "th";
    }

    getWeekNumber(year, month, day) {
        const d = new Date(Date.UTC(year, month - 1, day));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    /**
     * Deconstructs custom date ID tags and returns structural formatting arrays
     * @param {string} date - Expected format containing date tokens (e.g., "DATE_20260518")
     */
    createDateTitle(date) {
        // Deconstruct the date ID tag safely using your substring rules
        const yearPart = date.substr(5, 4);
        const monthPart = parseInt(date.substr(9, 2));
        const dayPart = parseInt(date.substr(11, 2));   

        // FIXED: Pointed to your custom standalone method 'this.getWeekNumber' 
        // to prevent native prototype errors
        const weekNumber = this.getWeekNumber(parseInt(yearPart), monthPart, dayPart);

        // Resolve day mapping values
        const dayofWeekName = new Date(yearPart, monthPart - 1, dayPart);
        const OrdinalDay = `${dayPart}${this.oridinalSuffix(dayPart)}`;

        return [
            `${this.dayNames[dayofWeekName.getDay()]}, ${this.monthNames[monthPart - 1]} ${OrdinalDay}, ${yearPart}`,
            dayofWeekName.getDay(), 
            weekNumber,
            [parseInt(yearPart), monthPart, dayPart]
        ];
    }    
}

window.DateObject = DateObject;
export default DateObject;

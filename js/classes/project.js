/**
 * Project: [NEW PROJECT NAME]
 * File:    project.js
 * Desc:    Domain Entity Class representing a tracking element.
 *          Handles local state intervals and execution ticks safely.
 **/

export default class Project {
    constructor(id, name, initialTime = 0) {
        this.id = id;
        this.name = name;
        this.seconds = initialTime;
        this.timer = null;
    }

    /**
     * Spins up the internal ticker engine
     * @param {Function} onTick - Callback executed every 1 second, receiving current seconds
     */
    start(onTick) {
        if (this.timer) return;
        
        this.timer = setInterval(() => {
            this.seconds++;
            // Defensive callback check prevents application crashes
            if (typeof onTick === 'function') {
                onTick(this.seconds);
            }
        }, 1000);
    }

    /**
     * Freezes the internal loop counter
     */
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    /**
     * Safety destructor to prevent background memory leaks if project is deleted
     */
    destroy() {
        this.stop();
    }
}

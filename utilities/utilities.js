//  this file contains the utilities used by the system

// import { DateObject  } from '../classes/dateClass.js';


window.Utils = {
   // creates the lists.
   createListSection(taskData) {
      var tasksList = "";
      // create the html lists for the popup
      tasks[taskData].forEach(element => {     
         tasksList += `<br><strong class="taskTitle">${element.title}:</strong><br>`;
         element.tasks.forEach(tasks => {
            let checkBoxTag = tasks.replace(/\s/g, '');
            let className = element.title.replace(/\s/g, '');
            tasksList += `<input type="checkbox" class="${className}" id="${checkBoxTag}_ID" value="${checkBoxTag}">
                           <label class = "taskList">${tasks}</label><br>`; 
            //console.log(checkBoxTag);  
            //$(`"#${checkBoxTag}_ID"`).attr("checked", true);
         })
      })
      return tasksList;
   },

   // creates time array /////////////////////////////////////
   createTimeArray(start, end, duration) {   

         var x  = times.substring(0,2);
         var y  = times.substring(2,4);
         var z  = times.substring(4,6);
         var k2 = times.substring(6);    
      
      const timeArray = [];
      for(let i = start; i < end; i++){  // hours
         for(let j = 0; j < k2; j++){  // minutes
            switch(j){
            case 0: var k = '00'; break;    
            case 1: var k = x; break;
            case 2: var k = y; break;
            case 3: var k = z; break;
            }
            if (i < 10){
               var times = `0${i}${k}`;
            } else {
               var times = `${i}${k}`;
            }
            timeArray.push(times)                     
         } 

         if (end < 10){
            var times = `0${end}00`;
         } else {
            var times = `${end}00`;
         }
         timeArray.push(times)
      }  
      return timeArray;
   },

   // find if the number is odd
   isOdd(num) { 
      return num % 2;
   },

   //////////////////////////////   Utilities to save and retrive from local storage   ////////////////////////////////////
   getFromLocalStorage(localStorageArrayName) {
      return JSON.parse(localStorage.getItem(localStorageArrayName)) || [];   
   },

   saveToLocalStorage(localStorageArrayName, inputArray) {
      localStorage.setItem(localStorageArrayName, JSON.stringify(inputArray));
   }
}

Object.assign(window, window.Utils || {});
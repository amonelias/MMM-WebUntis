/* global Module */

/* Magic Mirror
 * Module: MMM-WebUntis
 *
 * By amonelias https://github.com/amonelias
 * MIT Licensed.
 */

Module.register("MMM-WebUntis", {
    defaults: {
        refreshTime: 100000,
        url: "",
        school: "",
        class: "",
        days: 1,
        dateformat: "en-EN",
        timeformat: "en-DE",
    },

    start: function () {
        this.sendSocketNotification("FETCH_DATA", [this.config.school, this.config.url, this.config.class, this.config.days])
        let timer = setInterval(()=>{
            this.sendSocketNotification("FETCH_DATA", [this.config.school, this.config.url, this.config.class, this.config.days])
        }, this.config.refreshTime)
    },

    getDom: function() {
        let table = document.createElement("div")
        table.id = "webuntis"

        let content = document.createElement("div")
        content.id = "timetable"
        
        table.appendChild(content)
        return table
    },

    getStyles: function() {
        return [this.file('MMM-WebUntis.css')]
    },

    socketNotificationReceived: function(notification, payload) {
        document.getElementById("timetable").remove()
        switch(notification) {
            case "FETCHED_DATA":
                let timetable = document.createElement("div")
                timetable.id = "timetable"
                document.getElementById("webuntis").appendChild(timetable)
                this.showTimetable("timetable", payload[0], payload[1])
                break
            case "ERROR":
                let element =document.getElementById("timetable")
                error.style.color = "#ff0033"
                element.classList.add("medium", "regular")
                element.innerHTML = "ERROR"
                console.error("Error WebUntis: ", payload)
                break
          }
    },

    showTimetable: function(id, data, timegrid){
        let timetable = document.getElementById(id)

        let times = this.getTimes(data, timegrid)
        let dates = this.getDates(data)
    
        let periodColumn = this.getPeriodColumn(times)
        timetable.appendChild(periodColumn)
    
        for(let x = 0;x < dates.length;x++){
          column = this.getColumn(data, dates[x], times)
          column.id = "column" + (Number(x)+1)
          column.classList.add("column")
          timetable.appendChild(column)
        }

        if(this.data.position.includes("left")){
            timetable.style.justifyContent = "flex-start"
        }
        else if(this.data.position.includes("right")){
            timetable.style.justifyContent = "flex-end"
        }
        else{
            timetable.style.justifyContent = "center"
        }
    },

    getPeriodColumn: function(times){
        let column = document.createElement("div")
        column.id = "period-column"
        column.classList.add("column")

        let item = document.createElement("div")
        item.id = "legend"
        item.classList.add("item")
        item.innerHTML = "&nbsp;<br>&nbsp;"
        column.appendChild(item)

        let periods = document.createElement("div")
        periods.id = "periods"

        for(x in times){
            item = document.createElement("div")
            item.classList.add("period")
            
            let startTime = document.createElement("span")
            startTime.className = "period-starttime"
            startTime.innerHTML = this.convertUntisTime(times[x]["startTime"])

            let endTime = document.createElement("span")
            endTime.className = "period-endtime"
            endTime.innerHTML = this.convertUntisTime(times[x]["endTime"])

            let lessonNumber = document.createElement("span")
            lessonNumber.className = "period-number"
            lessonNumber.innerHTML = times[x]["name"]
            
            item.appendChild(startTime)
            item.appendChild(lessonNumber)
            item.appendChild(endTime)
            periods.appendChild(item)
        }
        column.appendChild(periods)
        return column
    },

    getColumn: function(timetable, date, times){
        let column = document.createElement("div")
        let item = document.createElement("div")

        // First Row (Day)
        item = document.createElement("div")
        item.classList.add("day")

        let day = document.createElement("div")
        day.classList.add("weekday")
        day.innerHTML = this.convertUntisDate(date, "d")

        let daydate = document.createElement("div")
        daydate.classList.add("date")
        daydate.innerHTML = this.convertUntisDate(date, "s")

        item.appendChild(day)
        item.appendChild(daydate)
        column.appendChild(item)

        // Other Rows (Lessons)
        lessons = document.createElement("div")
        lessons.classList.add("lessons")
        lessons.style.flexGrow = (times.length-1)

        let lessonsSubjects = this.getLessons(timetable, date, times)
        for(let j = 0;j < times.length;j++){
            item = document.createElement("div")
            item.classList.add("lesson")
            let size = 1
            if(j < (times.length-1)){
                for(let i = j+1;(lessonsSubjects[j].join('') === lessonsSubjects[i].join(''));i++){
                    size++
                    if(!(i < (times.length-1))){break}
                }
            }
            for(x in lessonsSubjects[j]){
                let subject = document.createElement("div")
                subject.classList.add("subject")
                subject.innerHTML = lessonsSubjects[j][x]
                item.appendChild(subject)
            }
            j = j + (size-1)
            let period = document.getElementsByClassName("period")[0]
            let periodHeight = period.getBoundingClientRect().height // Height with border and 
            let periodBorderWidth = Number(getComputedStyle(period,null).getPropertyValue('border-bottom-width').replace(/\D/g, ""))
            item.style.height = (periodHeight * size - periodBorderWidth) + "px"
            lessons.appendChild(item)
        }

        column.appendChild(lessons)
        return column
    },
    
    convertUntisTime: function(time){
        time = time.toString()
        let timeformat = this.config.timeformat
        let timeoptions = {hour: 'numeric', minute: 'numeric'}
        if(time.length==3){
            time = new Date(0, 0, 0, 0 + time[0], time[1] + time[2])
        }
        else if(time.length){
            time = new Date(0, 0, 0, time[0] + time[1], time[2] + time[3])
        }
        return time.toLocaleTimeString(timeformat, timeoptions)
    },

    convertUntisDate: function(date, option){
        date = date.toString()
        date = new Date(date[0] + date[1] + date[2] + date[3] + "-" + date[4] + date[5] + "-" + date[6] + date[7])
        let dateformat = this.config.dateformat
        let dateoptions
        switch(option){
            case "s":
                dateoptions = {month: 'numeric', day: 'numeric' }
                break
            case "l":
                dateoptions = {year: 'numeric', month: 'numeric', day: 'numeric' }
                break
            case "d":
                dateoptions = {weekday: 'short'}
                break
        }
      
        return date.toLocaleDateString(dateformat, dateoptions)
    },

    getDates: function(timetable){
        let dates = []
        for(x in timetable){
          dates.push(timetable[x].date)
        }
        return Array.from(new Set(dates.sort()))
    },

    getTimes: function(timetable, timegrid){
        let times = []
        timegrid = timegrid[0].timeUnits
        for(x in timegrid){
          if(timetable.filter(obj => obj.startTime >= timegrid[x]["startTime"]).length == 0){
            break
          }
          times[x] = []
          times[x]["startTime"] = timegrid[x]["startTime"]
          times[x]["endTime"] = timegrid[x]["endTime"]
          times[x]["name"] = timegrid[x]["name"]
        }
        return times
      },

    getLessons: function(timetable, date, times){
        let lessonSubjects = []
        for(j in times){
            let subjects = timetable.filter(obj => obj.date == date && obj.startTime == times[j]["startTime"])
            lessonSubjects[j] = []
            for(x in subjects){
            lessonSubjects[j].push(subjects[x]["su"][0]["name"])
            }
            lessonSubjects[j] = Array.from(new Set(lessonSubjects[j]))
        }
        return lessonSubjects
    },

  })
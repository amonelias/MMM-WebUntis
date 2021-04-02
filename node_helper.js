/* Magic Mirror
 * Node Helper: MMM-WebUntis
 *
 * By amonelias https://github.com/amonelias
 * MIT Licensed.
 */

'use strict'
const NodeHelper = require("node_helper")
const WebUntisLib = require("webuntis")
const fs = require('fs')

module.exports = NodeHelper.create({
  start: function() {},

  socketNotificationReceived: function(notification, payload) {
    switch(notification) {
        case "FETCH_DATA":
          this.fetchTimetable(payload[0], payload[1], payload[2], payload[3])
          break
      }
  },

  fetchTimetable: function(school, url, classname, days){
    let curr = new Date // get current date

    let firstday = new Date(curr.setDate(curr.getDate()))
    let lastday = new Date(curr.setDate(curr.getDate() + days))

    let timetable
    let timegrid

    const untis = new WebUntisLib.WebUntisAnonymousAuth(
      school,
      url
    )

    untis
          .login()
          .then(() => {
            untis.getTimegrid()
                  .then(grid => {
                    timegrid = grid
                  })
          })
          .then(() => {
              return untis.getClasses()
          })
          .then(classes => {
                this.class = classes.find(obj => obj.name == classname)
                return untis.getTimetableForRange(firstday, lastday, this.class.id, WebUntisLib.TYPES.CLASS)
            })
          .then(table => {
            timetable = table
          })
          .then(() => {
            this.printJSONToFile(timetable)
            this.sendSocketNotification("FETCHED_DATA", [timetable, timegrid])
          })
  },

  // output results in file
  printJSONToFile: function(timetable){
    fs.writeFile("modules/MMM-WebUntis/output.json", JSON.stringify(timetable, null, 4), 'utf8', function (err){
      if (err) {
        console.log("An error occured while writing JSON Object to File.")
        return console.log(err)
      } 
    })
  },

})

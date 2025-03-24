// Obsidian view template for displaying weekly timeline
let { pages, date, view, startPosition, slot } = input

// // Error Handling
if (startPosition) { if (!startPosition.match(/\d{4}\-\d{1,2}/gm)) { dv.span('> [!ERROR] Wrong startPosition format\n> \n> Please set a startPosition with the following format\n> \n> Month: `YYYY-MM` | Week: `YYYY-ww`'); return false } };

if (!pages) {
  var files = dv.pages('#dayschedule').where(p => p.file.path != dv.current().file.path)
} else {
  var files = dv.pages(pages)
}
var tasks = {};
async function getTasks() {
  var taskList = [];
  for (let index = 0; index < files.length; index++) {
    const p = files[index];

    const curTFile = await app.vault.getFileByPath(p.file.path);
    const content = await app.vault.cachedRead(curTFile);
    let tasksStr = content.slice(content.indexOf("Hello!") + 7);
    const lines = tasksStr.split("\n");
    lines.forEach(line => {
      taskList.push(JSON.parse(line));
    })
  }
  return mapTasks(taskList);
}

function mapTasks(taskList) {
  let grouped = {};
  taskList.forEach(event => {
    let dateKey = moment(event.tm).format("YYYY-MM-DD");
    if (!grouped[dateKey]) {
      grouped[dateKey]= [];
    }
    grouped[dateKey].push(event);
  });
  for (let date in grouped) {
    let taskItems = grouped[date];
    if (taskItems[0].tp == "end") {
      taskItems.splice(0, 1);
    }
    let events = [];
    let event = {};
    for (let index = 0; index < taskItems.length - 1; index += 2) {
      const task = taskItems[index];
      const task2 = taskItems[index + 1];
      if (task.tp == "start" && task2.tp == "end") {
        event = {
          "tp": "event",
          "tm": [task.tm, task2.tm],
          "e": task.e,
          "n": task.n,
          "c": task2.c
        };
        events.push(event);
      }
    }
    if (taskItems[taskItems.length - 1].tp == "start") {
      taskItems.push({
        "c":"Good",
        "tp": "end",
        "tm": moment().format("yyyy-MM-dd HH:mm")
      });
    }
    // map.set(date, events);
    grouped[date] = events;
  }

  return grouped;
}
var tToday = moment().format("YYYY-MM-DD");
var cMonth = moment().format("YYYY-MM");
var tMonth = moment().format("M");
var tDay = moment().format("d");
var tYear = moment().format("YYYY");
const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
if (startPosition) { var selectedMonth = moment(startPosition, "YYYY-MM").date(1); var selectedWeek = moment(startPosition, "YYYY-ww").startOf("week") } else { var selectedMonth = moment().date(1); var selectedWeek = moment().startOf("week") };
if (!slot) {slot = ["8:00", "2:30"]}
var selectedDate = eval("selected" + capitalize(view));
var arrowLeftIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>';
var arrowRightIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
var monthIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>';
var weekIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M17 14h-6"></path><path d="M13 18H7"></path><path d="M7 14h.01"></path><path d="M17 18h.01"></path></svg>';
var cellTemplate = "<li class='cd-schedule__event' style='{{cellStyle}}'><a data-start='{{start}}' data-end='{{end}}' href='#0'></a></li>";
var dayTemplate = "<section class='cd-schedule__group'><div class='cd-schedule__top-info'><span>{{day}}</span></div><ul>{{cell}}</ul></section>";
var timeDiv = "<div class='cd-schedule__timeline'>" +generateTimeList(slot[0], slot[1],30)+"</div>";
var group = "<div class='cd-schedule__events'><ul>";
const taskColors = {
  'study': '#d05a63',
  'work': '#d05a63',
  "entertainment": "#F5A623",
  "social media": "#BD10E0",
  "commute": "#F5A623",
  "exercise": "#7ED321",
  "hygiene": "#50E3C2",
  "wake up": "#abd58e",
  "sleep": "#9013FE",
  "meals": "#D0021B"
}

var tid = (new Date()).getTime();
const rootNode = dv.el("div", "", { cls: "timeline", attr: { id: "timeline" + tid, view: view } });
// const
setButtons();
getTasks().then(e=> {
  tasks = e;
  // console.log(e)
  getMonthlyView(selectedDate);
});

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
};
function generateTimeList(startTime, endTime, interval = 15) {
  let times = "";
  let start = moment(startTime, "HH:mm");
  let end = moment(endTime, "HH:mm");
  if (end.isBefore(start)) {
    end.add(1, 'day');
  }

while (start <= end) {
      times+=`<div class='time-row'><span class='time-row-label'>${start.format("HH:mm")}</span></div>`;
      start.add(interval, 'minutes');
  }
  
  return times;
}

function setButtons() {
  var buttons = "<button class='monthView' title='Month'>" + monthIcon + "</button><button class='weekView' title='Week'>" + weekIcon + "</button><button class='current'></button><button class='previous'>" + arrowLeftIcon + "</button><button class='next'>" + arrowRightIcon + "</button><button class='statistic' percentage=''></button>";
  rootNode.querySelector("span").appendChild(dv.el("div", buttons, { cls: "buttons", attr: {} }));
  // setButtonEvents();
};

function getMonthlyView(month) {
  var lastDayOfMonth = moment(month).endOf("month").format("D");
  let timelineUnitDuration = getScheduleTimestamp(slot[1])-getScheduleTimestamp(slot[0]);
  if (timelineUnitDuration < 0) {timelineUnitDuration+=24*60;}
  let timelineStart = getScheduleTimestamp(slot[0]);
  let timelineEnd = getScheduleTimestamp(slot[1]);
  var slotHeight = 30;
  
  let dayCells = "";
  for (h = 0; h < lastDayOfMonth; h++) {
    var dateName = moment(month).add(h, "days").format("D");
    var curDate = moment(month).add(h, "days").format("YYYY-MM-DD");
    var weekDayName = moment(month).add(h, "days").format("ddd");

    let curDayTask = tasks[curDate];
    let todayCells = "";

    if (curDayTask && curDayTask.length > 0) {
      curDayTask.forEach(t => {
        var start = getScheduleTimestamp(t.tm[0].split(' ')[1]),
        duration = getScheduleTimestamp(t.tm[1].split(' ')[1]) - start;
        let startOffset=start - timelineStart;
        if (startOffset < 0) {
          startOffset=timelineUnitDuration-timelineEnd+start;
        }
        var eventTop = slotHeight*(timelineUnitDuration/30)*(startOffset)/timelineUnitDuration,
        eventHeight = slotHeight*(timelineUnitDuration/30)*(duration)/timelineUnitDuration;

        todayCells += cellTemplate.replace("{{start}}", t.tm[0]).replace("{{end}}", t.tm[1]).replace("{{cellStyle}}", `background-color:${taskColors[t.e]};top:${eventTop-1}px;height:${eventHeight +1}px;`).replace("{{note}}", t.n);
      });
      
    }
    dayCells += dayTemplate.replace("{{day}}", dateName).replace("{{cell}}", todayCells);
  };
  var div = "<div class='cd-schedule margin-top-lg margin-bottom-lg js-cd-schedule'>" + timeDiv + "<div class='cd-schedule__events'>" + dayCells + "</div></div>";

  rootNode.querySelector("span").appendChild(dv.el("div", div, { cls: "grid" }));		
}

function getScheduleTimestamp(time) {
  //accepts hh:mm format - convert hh:mm to timestamp
  time = time.replace(/ /g,'');
  var timeArray = time.split(':');
  var timeStamp = parseInt(timeArray[0])*60 + parseInt(timeArray[1]);
  return timeStamp;
};

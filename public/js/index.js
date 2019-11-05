'use strict';

function init() {
  loadData();
  carouselInit();
}


function loadData() {
  $.get('/upcoming/5', calendarItems => {
    const section = $('#upcoming');
    calendarItems.forEach(event => {
      let pEl = $('<p class="upcoming-item"></p>');
      let dateEl = $('<span class="upcoming-date"></span>');
      let startTimeEl = $('<span class="upcoming-start-time"></span>');
      let endTimeEl = $('<span class="upcoming-end-time"></span>');
      let titleEl = $('<span class="upcoming-title"></span>');
      dateEl.text(event.date);
      titleEl.text(event.eventTitle);
      startTimeEl.text(event.start);
      endTimeEl.text(event.end);
      pEl.append(dateEl);
      pEl.append(startTimeEl);
      pEl.append(endTimeEl);
      pEl.append(titleEl);
      section.append(pEl);
    });
  });
}

$().ready(init);


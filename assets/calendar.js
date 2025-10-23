// calendar.js - carga FullCalendar desde CDN e inicializa un calendario simple
(function(){
  function loadScript(src, cb){
    var s = document.createElement('script');
    s.src = src; s.onload = cb; s.onerror = function(){ console.error('Error loading', src); cb(); }; document.head.appendChild(s);
  }

  // Ensure DOM ready before initializing
  function onReady(cb){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cb);
    else cb();
  }

  function init(){
    console.log('calendar.js: init called, FullCalendar=', !!window.FullCalendar);
    var calendarEl = document.getElementById('calendar');
    if (!calendarEl) {
      console.warn('calendar.js: #calendar element not found');
      return;
    }

    if (!window.FullCalendar) {
      console.warn('calendar.js: FullCalendar not present after load');
      return;
    }

    try {
      var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
          { title: 'Evento 1', start: new Date().toISOString().slice(0,10) },
          { title: 'Evento 2', start: new Date(new Date().setDate(new Date().getDate()+3)).toISOString().slice(0,10) }
        ]
      });
      calendar.render();
      console.log('calendar.js: calendar rendered');
    } catch (err) {
      console.error('calendar.js: error initializing FullCalendar', err);
    }
  }

  onReady(function(){
    // Load FullCalendar v5 and its plugins (dayGrid) used by v5
    if (!window.FullCalendar) {
      loadScript('https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js', function(){
        console.log('calendar.js: FullCalendar script loaded');
        init();
      });
    } else {
      init();
    }
  });

})();
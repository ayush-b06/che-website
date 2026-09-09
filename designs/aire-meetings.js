(() => {
  const { meetings } = JSON.parse(document.querySelector('#meeting-data').textContent);
  const title = document.querySelector('#meeting-title');
  const kicker = document.querySelector('[data-meeting-kicker]');
  const time = document.querySelector('[data-meeting-time]');
  const location = document.querySelector('[data-meeting-location]');
  const timeZone = 'America/Los_Angeles';
  const dateFormat = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short', month: 'short', day: 'numeric' });
  const timeFormat = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit' });
  function update() {
    const now = Date.now();
    const meeting = [...meetings].sort((a, b) => Date.parse(a.start) - Date.parse(b.start)).find(m => Date.parse(m.end) > now);
    if (!meeting) {
      kicker.textContent = 'General meetings';
      title.textContent = 'Find your next meeting';
      time.textContent = 'Wednesdays · 6–7 p.m. during the semester';
      location.textContent = 'See the live calendar below for upcoming dates and locations.';
      return;
    }
    const start = new Date(meeting.start), end = new Date(meeting.end);
    kicker.textContent = start.getTime() <= now ? 'Happening now' : 'Next general meeting';
    title.textContent = meeting.title;
    time.textContent = `${dateFormat.format(start)} · ${timeFormat.format(start)}–${timeFormat.format(end)} PT`;
    location.textContent = meeting.location || 'Location to be announced. Email us before heading over.';
  }
  update();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  setInterval(update, 60000);
})();

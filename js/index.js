const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const times = ["8:00", "1:00", "6:00", "8:00", "8:00", "9:00", "9:00"];
const grid = document.getElementById("grid7");
let activeIndex = 0;

days.forEach((d, i) => {
  const el = document.createElement("div");
  el.className = "compartment";
  el.innerHTML = `<span class="day">${d}</span><span class="pill"></span><span class="time">${times[i]}</span>`;
  grid.appendChild(el);
});
// 8th tile: today's "due now" slot, larger emphasis via ordering handled by CSS grid auto-flow
const compartments = () => document.querySelectorAll(".compartment");

function setActive(i) {
  compartments().forEach((c, idx) => c.classList.toggle("active", idx === i));
}
setActive(0);

const chip = document.getElementById("statusChip");
const clockDisplay = document.getElementById("clockDisplay");
const labels = [
  "8:00 AM",
  "1:00 PM",
  "6:00 PM",
  "8:00 AM",
  "8:00 AM",
  "9:00 AM",
  "9:00 AM",
];
const doseNames = [
  "Morning dose",
  "Midday dose",
  "Evening dose",
  "Morning dose",
  "Morning dose",
  "Morning dose",
  "Morning dose",
];

setInterval(() => {
  activeIndex = (activeIndex + 1) % days.length;
  setActive(activeIndex);
  clockDisplay.textContent = labels[activeIndex];
  chip.innerHTML = `<span class="dot"></span> ${doseNames[activeIndex]} ready`;
}, 3200);

// CTA form (static demo — no backend)
const form = document.getElementById("waitlistForm");
const msg = document.getElementById("ctaMsg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  msg.textContent = "You're on the list — we'll email you when Cadence ships.";
  form.reset();
});

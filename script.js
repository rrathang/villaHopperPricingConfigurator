let pricing = {};

async function loadPricing() {
  const res = await fetch("pricing.json");
  pricing = await res.json();
  document.getElementById("pricingJson").value = JSON.stringify(pricing, null, 2);
  renderRoomControls();
}

function renderRoomControls() {
  const container = document.getElementById("roomControls");
  container.innerHTML = "";
  for (const key in pricing.rooms) {
    const r = pricing.rooms[key];
    const div = document.createElement("div");

    div.innerHTML = `
      <strong>${r.display}</strong> (${r.count})
      <button class="num-btn" onclick="changeRoom('${key}', -1)">-</button>
      <input type="number" id="room_${key}" value="0" min="0" max="${r.count}" />
      <button class="num-btn" onclick="changeRoom('${key}', 1)">+</button>
    `;
    container.appendChild(div);
  }
}

function changeRoom(key, delta) {
  const inp = document.getElementById(`room_${key}`);
  inp.value = Math.min(Math.max(0, Number(inp.value) + delta), pricing.rooms[key].count);
}

function isoDate(d) {
  return d.toISOString().split('T')[0];
}

function isWeekendOrHoliday(dateStr) {
  const d = new Date(dateStr);
  const dow = d.getDay();
  return dow === 0 || dow === 6 || pricing.holidays.includes(dateStr);
}

function dateRange(start, end) {
  return (new Date(end) - new Date(start)) / (1000 * 3600 * 24);
}

// Calculate price

document.getElementById("calcBtn").onclick = () => {
  const start = startDate.value;
  const end = endDate.value;
  const nights = dateRange(start, end);
  if (nights <= 0) { summaryBox.innerHTML = "Invalid date range"; return; }

  let selectedRooms = {};
  for (const key in pricing.rooms) {
    let v = Number(document.getElementById(`room_${key}`).value);
    if (v > 0) selectedRooms[key] = v;
  }

  const extraBeds = Number(extraBeds.value);
  const guests = Number(document.getElementById("guests").value);
  const mealOpt = mealOption.value;

  let total = 0;
  let breakdown = [];

  for (let i = 0; i < nights; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const ds = isoDate(d);

    const holiday = isWeekendOrHoliday(ds);

    let nightTotal = 0;

    for (const key in selectedRooms) {
      const r = pricing.rooms[key];
      const rate = holiday ? r.holiday_rate : r.weekday_rate;
      nightTotal += rate * selectedRooms[key];
    }

    const eb_rate = holiday ? pricing.extra_bed.holiday_rate : pricing.extra_bed.weekday_rate;
    nightTotal += eb_rate * extraBeds;

    let mealCost = 0;
    if (mealOpt === "dinner") mealCost = pricing.meals.dinner.per_person * guests;
    if (mealOpt === "breakfast_dinner") mealCost = (pricing.meals.breakfast.per_person + pricing.meals.dinner.per_person) * guests;
    nightTotal += mealCost;

    total += nightTotal;
    breakdown.push({ date: ds, nightTotal });
  }

  const result = { start, end, nights, selectedRooms, extraBeds, guests, mealOpt, total, breakdown };
  outputJson.textContent = JSON.stringify(result, null, 2);
  summaryBox.innerHTML = `Total: ₹${total}`;
};

// Export

document.getElementById("exportBtn").onclick = () => {
  const blob = new Blob([outputJson.textContent], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "booking.json";
  a.click();
};

// Load/Reset JSON

document.getElementById("loadJson").onclick = () => {
  try {
    pricing = JSON.parse(pricingJson.value);
    renderRoomControls();
  } catch {
    alert("Invalid JSON");
  }
};

document.getElementById("resetJson").onclick = loadPricing;

// Boot
loadPricing();
let pricing = {};


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
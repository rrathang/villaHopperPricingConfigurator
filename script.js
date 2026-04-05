document.addEventListener('DOMContentLoaded', () => {

  // Configuration Constants
  const BASE_PRICE = 2000;
  const ROOM_PRICE = 3000;
  const EXTRA_BED_PRICE = 1000;
  const BREAKFAST_PRICE = 200;
  const DINNER_PRICE = 500;

  // DOM Elements - Inputs
  const roomCheckboxes = document.querySelectorAll('.room-checkbox');
  const room1Checkbox = document.getElementById('room1');
  const room2Checkbox = document.getElementById('room2');
  const room3Checkbox = document.getElementById('room3');
  const room4Checkbox = document.getElementById('room4');
  
  const room1Addons = document.getElementById('room1Addons');
  const room2Addons = document.getElementById('room2Addons');
  const room3Addons = document.getElementById('room3Addons');
  const room4Addons = document.getElementById('room4Addons');
  
  const room1ExtraBeds = document.getElementById('room1ExtraBeds');
  const room2ExtraBeds = document.getElementById('room2ExtraBeds');
  const room3ExtraBeds = document.getElementById('room3ExtraBeds');
  const room4ExtraBeds = document.getElementById('room4ExtraBeds');
  
  const breakfastOption = document.getElementById('breakfastOption');
  const dinnerOption = document.getElementById('dinnerOption');
  const cleaningPriceInput = document.getElementById('cleaningPrice');

  // DOM Elements - Displays
  const displayBasePrice = document.getElementById('displayBasePrice');
  const displayRoomTotal = document.getElementById('displayRoomTotal');
  const displayBedTotal = document.getElementById('displayBedTotal');
  const displayMealsTotal = document.getElementById('displayMealsTotal');
  const displayCleaning = document.getElementById('displayCleaning');
  const displayGrandTotal = document.getElementById('displayGrandTotal');
  const displayTotalGuests = document.getElementById('displayTotalGuests');
  const guestBanner = document.getElementById('guestBanner');

  /**
   * Formatting Utility
   */
  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  /**
   * Helper to update specific addon row
   */
  const toggleAddon = (checkbox, addonSection, extraBedsInput) => {
    if (checkbox.checked) {
      addonSection.classList.remove('disabled');
      extraBedsInput.disabled = false;
    } else {
      addonSection.classList.add('disabled');
      extraBedsInput.disabled = true;
      extraBedsInput.value = "0"; // reset select
    }
  };

  /**
   * Toggle Extra Bed Inputs Based on Room Selection
   */
  const updateAddonStatus = () => {
    toggleAddon(room1Checkbox, room1Addons, room1ExtraBeds);
    toggleAddon(room2Checkbox, room2Addons, room2ExtraBeds);
    toggleAddon(room3Checkbox, room3Addons, room3ExtraBeds);
    toggleAddon(room4Checkbox, room4Addons, room4ExtraBeds);
  };

  /**
   * Core Calculation Logic
   */
  const calculateTotal = () => {
    // 1. Base Price
    const baseTotal = BASE_PRICE;

    // 2. Room Total & Base Guests
    let activeRooms = 0;
    roomCheckboxes.forEach(cb => {
      if (cb.checked) activeRooms++;
    });
    const roomTotal = activeRooms * ROOM_PRICE;
    const baseGuests = activeRooms * 2;

    // 3. Extra Beds Total
    const extraBeds1 = parseInt(room1ExtraBeds.value) || 0;
    const extraBeds2 = parseInt(room2ExtraBeds.value) || 0;
    const extraBeds3 = parseInt(room3ExtraBeds.value) || 0;
    const extraBeds4 = parseInt(room4ExtraBeds.value) || 0;
    
    const totalExtraBeds = extraBeds1 + extraBeds2 + extraBeds3 + extraBeds4;
    const bedTotal = totalExtraBeds * EXTRA_BED_PRICE;

    // 4. Total Guests Calc
    const totalGuests = baseGuests + totalExtraBeds;
    
    // Toggle Guest Banner Visibility
    if (totalGuests > 0) {
      guestBanner.classList.remove('hidden');
    } else {
      guestBanner.classList.add('hidden');
    }

    // 5. Meals Selection
    let mealsTotal = 0;
    if (breakfastOption.checked) {
      mealsTotal += (totalGuests * BREAKFAST_PRICE);
    }
    if (dinnerOption.checked) {
      mealsTotal += (totalGuests * DINNER_PRICE);
    }

    // 6. Cleaning
    const cleaningPrice = parseFloat(cleaningPriceInput.value) || 0;

    // 7. Grand Total
    const grandTotal = baseTotal + roomTotal + bedTotal + mealsTotal + cleaningPrice;

    // Update UI
    displayBasePrice.textContent = formatCurrency(baseTotal);
    displayRoomTotal.textContent = formatCurrency(roomTotal);
    displayBedTotal.textContent = formatCurrency(bedTotal);
    displayMealsTotal.textContent = formatCurrency(mealsTotal);
    displayCleaning.textContent = formatCurrency(cleaningPrice);
    displayGrandTotal.textContent = formatCurrency(grandTotal);
    displayTotalGuests.textContent = totalGuests;
  };

  /**
   * Event Listeners
   */
  
  // Listen to room checkboxes
  roomCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      updateAddonStatus();
      calculateTotal();
    });
  });

  // Listen to extra bed inputs
  room1ExtraBeds.addEventListener('change', calculateTotal);
  room2ExtraBeds.addEventListener('change', calculateTotal);
  room3ExtraBeds.addEventListener('change', calculateTotal);
  room4ExtraBeds.addEventListener('change', calculateTotal);

  // Listen to meal selections
  breakfastOption.addEventListener('change', calculateTotal);
  dinnerOption.addEventListener('change', calculateTotal);

  // Listen to cleaning charge input
  if (cleaningPriceInput) {
    cleaningPriceInput.addEventListener('input', calculateTotal);
  }

  // Initial UI Setup & Calculation
  updateAddonStatus();
  calculateTotal();

  /**
   * Copy to Clipboard Logic
   */
  const copyBtn = document.getElementById('copyBtn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      let activeRooms = 0;
      let activeRoomNames = [];
      roomCheckboxes.forEach((cb, index) => {
        if (cb.checked) {
          activeRooms++;
          activeRoomNames.push(`Room ${index + 1}`);
        }
      });
      
      const roomTotal = activeRooms * ROOM_PRICE;
      const extraBeds1 = parseInt(room1ExtraBeds.value) || 0;
      const extraBeds2 = parseInt(room2ExtraBeds.value) || 0;
      const extraBeds3 = parseInt(room3ExtraBeds.value) || 0;
      const extraBeds4 = parseInt(room4ExtraBeds.value) || 0;
      const totalExtraBeds = extraBeds1 + extraBeds2 + extraBeds3 + extraBeds4;
      const bedTotal = totalExtraBeds * EXTRA_BED_PRICE;
      
      const totalGuests = (activeRooms * 2) + totalExtraBeds;
      
      let mealsTotal = 0;
      const mealsIncluded = [];
      if (breakfastOption.checked) {
        mealsTotal += (totalGuests * BREAKFAST_PRICE);
        mealsIncluded.push(`Breakfast (${formatCurrency(BREAKFAST_PRICE)}/hd)`);
      }
      if (dinnerOption.checked) {
        mealsTotal += (totalGuests * DINNER_PRICE);
        mealsIncluded.push(`Dinner (${formatCurrency(DINNER_PRICE)}/hd)`);
      }

      const cleaningPrice = parseFloat(cleaningPriceInput.value) || 0;
      const grandTotal = BASE_PRICE + roomTotal + bedTotal + mealsTotal + cleaningPrice;

      // Format String (WhatsApp Style)
      let textToCopy = `*Villa Rental Quote* 🏡\n\n`;
      textToCopy += `*Base Booking Fee:* ${formatCurrency(BASE_PRICE)}\n`;
      textToCopy += `_(Venue access charge)_\n\n`;

      if (activeRooms > 0) {
        textToCopy += `*Selected Rooms:* (${activeRoomNames.join(', ')})\n`;
        textToCopy += `${activeRooms} x ${formatCurrency(ROOM_PRICE)} = ${formatCurrency(roomTotal)}\n\n`;
      }

      if (totalExtraBeds > 0) {
        textToCopy += `*Extra Beds:* \n`;
        textToCopy += `${totalExtraBeds} x ${formatCurrency(EXTRA_BED_PRICE)} = ${formatCurrency(bedTotal)}\n\n`;
      }
      
      textToCopy += `👥 *Total Guests:* ${totalGuests}\n\n`;

      if (mealsIncluded.length > 0) {
        textToCopy += `*Meals Included:* ${mealsIncluded.join(' + ')}\n`;
        textToCopy += `Total Meal Cost: ${formatCurrency(mealsTotal)}\n\n`;
      }

      textToCopy += `*Cleaning Charges:* ${formatCurrency(cleaningPrice)}\n\n`;
      textToCopy += `-----------------------------\n`;
      textToCopy += `*GRAND TOTAL: ${formatCurrency(grandTotal)}*\n`;
      textToCopy += `-----------------------------`;

      // Copy API
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied! ✅";
        copyBtn.style.background = "#27ae60"; // Success Green

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = ""; // Reset
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        alert("Failed to copy text.");
      });
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {

  // Configuration Constants
  const BASE_PRICE = 2000;
  const ROOM_PRICE = 3000;
  const EXTRA_BED_PRICE = 1000;

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
  
  const cleaningPriceInput = document.getElementById('cleaningPrice');

  // DOM Elements - Displays
  const displayBasePrice = document.getElementById('displayBasePrice');
  const displayRoomTotal = document.getElementById('displayRoomTotal');
  const displayBedTotal = document.getElementById('displayBedTotal');
  const displayCleaning = document.getElementById('displayCleaning');
  const displayGrandTotal = document.getElementById('displayGrandTotal');

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
      extraBedsInput.value = 0; // reset
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

    // 2. Room Total
    let activeRooms = 0;
    roomCheckboxes.forEach(cb => {
      if (cb.checked) activeRooms++;
    });
    const roomTotal = activeRooms * ROOM_PRICE;

    // 3. Extra Beds Total
    const extraBeds1 = parseInt(room1ExtraBeds.value) || 0;
    const extraBeds2 = parseInt(room2ExtraBeds.value) || 0;
    const extraBeds3 = parseInt(room3ExtraBeds.value) || 0;
    const extraBeds4 = parseInt(room4ExtraBeds.value) || 0;
    
    const totalExtraBeds = extraBeds1 + extraBeds2 + extraBeds3 + extraBeds4;
    const bedTotal = totalExtraBeds * EXTRA_BED_PRICE;

    // 4. Cleaning
    const cleaningPrice = parseFloat(cleaningPriceInput.value) || 0;

    // 5. Grand Total
    const grandTotal = baseTotal + roomTotal + bedTotal + cleaningPrice;

    // Update UI
    displayBasePrice.textContent = formatCurrency(baseTotal);
    displayRoomTotal.textContent = formatCurrency(roomTotal);
    displayBedTotal.textContent = formatCurrency(bedTotal);
    displayCleaning.textContent = formatCurrency(cleaningPrice);
    displayGrandTotal.textContent = formatCurrency(grandTotal);
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
  room1ExtraBeds.addEventListener('input', calculateTotal);
  room2ExtraBeds.addEventListener('input', calculateTotal);
  room3ExtraBeds.addEventListener('input', calculateTotal);
  room4ExtraBeds.addEventListener('input', calculateTotal);

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
      const cleaningPrice = parseFloat(cleaningPriceInput.value) || 0;
      const grandTotal = BASE_PRICE + roomTotal + bedTotal + cleaningPrice;

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
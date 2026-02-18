document.addEventListener('DOMContentLoaded', () => {
  // State
  const seasonalPrices = {
    regular: 4000,
    weekend: 5000,
    peak: 6000
  };

  // DOM Elements
  const seasonSelect = document.getElementById('seasonSelect');
  const basePriceInput = document.getElementById('basePrice');
  const cleaningPriceInput = document.getElementById('cleaningPrice');
  const roomPriceMasterInput = document.getElementById('roomPriceMaster');
  const addRoomBtn = document.getElementById('addRoomBtn');
  const roomsContainer = document.getElementById('roomsContainer');
  const guestCountInput = document.getElementById('guestCount');
  const guestPriceInput = document.getElementById('guestPrice');

  // Display Elements
  const displayBasePrice = document.getElementById('displayBasePrice');
  const displayRoomTotal = document.getElementById('displayRoomTotal');
  const displayGuestTotal = document.getElementById('displayGuestTotal');
  const displayCleaning = document.getElementById('displayCleaning');
  const displayGrandTotal = document.getElementById('displayGrandTotal');

  /**
   * Formatting Utility
   */
  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  /**
   * Core Calculation Logic
   */
  const calculateTotal = () => {
    // 1. Base Price
    const basePrice = parseFloat(basePriceInput.value) || 0;

    // 2. Cleaning
    const cleaningPrice = parseFloat(cleaningPriceInput.value) || 0;

    // 3. Additional Rooms
    let roomsTotal = 0;
    const roomInputs = document.querySelectorAll('.room-price-input');
    roomInputs.forEach(input => {
      roomsTotal += parseFloat(input.value) || 0;
    });

    // 4. Additional Guests
    const guestCount = parseFloat(guestCountInput.value) || 0;
    const guestPrice = parseFloat(guestPriceInput.value) || 0;
    const guestsTotal = guestCount * guestPrice;

    // 5. Grand Total
    const grandTotal = basePrice + cleaningPrice + roomsTotal + guestsTotal;

    // Update UI
    displayBasePrice.textContent = formatCurrency(basePrice);
    displayCleaning.textContent = formatCurrency(cleaningPrice);
    displayRoomTotal.textContent = formatCurrency(roomsTotal);
    displayGuestTotal.textContent = formatCurrency(guestsTotal);
    displayGrandTotal.textContent = formatCurrency(grandTotal);
  };

  /**
   * Event Handlers
   */

  // Season Change
  seasonSelect.addEventListener('change', (e) => {
    const selected = e.target.value;
    if (seasonalPrices[selected]) {
      basePriceInput.value = seasonalPrices[selected];
    }
    // If 'custom', we leave the current value or let user edit it
    calculateTotal();
  });

  // Add Room
  addRoomBtn.addEventListener('click', () => {
    const roomCount = roomsContainer.children.length + 1;
    const defaultPrice = roomPriceMasterInput.value;

    const roomRow = document.createElement('div');
    roomRow.classList.add('dynamic-row');
    roomRow.innerHTML = `
            <span>Room ${roomCount + 1}</span> <!-- +1 because Base includes Room 1 -->
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="number" class="room-price-input" value="${defaultPrice}" style="width: 100px;">
                <button class="btn-danger remove-room">&times;</button>
            </div>
        `;

    // Add event listener to new input
    const input = roomRow.querySelector('input');
    input.addEventListener('input', calculateTotal);

    // Add event listener to remove button
    const removeBtn = roomRow.querySelector('.remove-room');
    removeBtn.addEventListener('click', () => {
      roomRow.remove();
      calculateTotal();
      updateRoomLabels();
    });

    roomsContainer.appendChild(roomRow);
    calculateTotal();
  });

  // Update Room Labels (e.g. after deletion)
  const updateRoomLabels = () => {
    const rows = roomsContainer.querySelectorAll('.dynamic-row');
    rows.forEach((row, index) => {
      const label = row.querySelector('span');
      label.textContent = `Room ${index + 2}`; // Start from Room 2
    });
  };

  // Global Input Listener for Static Inputs
  const staticInputs = [
    basePriceInput,
    cleaningPriceInput,
    guestCountInput,
    guestPriceInput
  ];

  staticInputs.forEach(input => {
    input.addEventListener('input', calculateTotal);
  });

  // Initial Calculation
  calculateTotal();

  /**
   * Copy to Clipboard Logic
   */
  const copyBtn = document.getElementById('copyBtn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      // Gather Data
      const basePrice = parseFloat(basePriceInput.value) || 0;
      const cleaningPrice = parseFloat(cleaningPriceInput.value) || 0;
      const guestCount = parseFloat(guestCountInput.value) || 0;
      const guestPrice = parseFloat(guestPriceInput.value) || 0;
      const guestsTotal = guestCount * guestPrice;

      let roomsText = "";
      let roomsTotal = 0;
      const roomInputs = document.querySelectorAll('.room-price-input');
      roomInputs.forEach((input, index) => {
        const val = parseFloat(input.value) || 0;
        roomsTotal += val;
        roomsText += `Room ${index + 2}: ${formatCurrency(val)}\n`;
      });

      const grandTotal = basePrice + cleaningPrice + roomsTotal + guestsTotal;
      const seasonName = seasonSelect.options[seasonSelect.selectedIndex].text;

      // Format String (WhatsApp Style)
      const textToCopy = `*Villa Rental Quote* 🏡

*Base Price (${seasonName}):* ${formatCurrency(basePrice)}
_(Includes 1 Room & 2 Guests)_

${roomsTotal > 0 ? `*Additional Rooms:*
${roomsText}` : ''}
${guestCount > 0 ? `*Extra Guests:* ${guestCount} x ${formatCurrency(guestPrice)} = ${formatCurrency(guestsTotal)}
` : ''}
*Cleaning Charges:* ${formatCurrency(cleaningPrice)}

-----------------------------
*GRAND TOTAL: ${formatCurrency(grandTotal)}*
-----------------------------`;

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
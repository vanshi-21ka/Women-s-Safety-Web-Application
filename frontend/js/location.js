// ===== LOCATION SHARING FEATURE =====

let currentPosition = null;

function openLocationModal() {
  const status = document.getElementById("location-status");
  const coordsDiv = document.getElementById("location-coords");

  status.textContent = "Getting your location...";
  coordsDiv.textContent = "";

  openModal("location-modal");

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      status.textContent = "Location found!";
      coordsDiv.innerHTML = `
        Latitude: ${currentPosition.lat.toFixed(6)}<br>
        Longitude: ${currentPosition.lng.toFixed(6)}
      `;
    },
    (error) => {
      let message = "Unable to get location.";
      if (error.code === 1) message = "Permission denied. Please allow location access.";
      if (error.code === 2) message = "Location unavailable.";
      if (error.code === 3) message = "Location request timed out.";
      status.textContent = message;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// Share via WhatsApp
document.getElementById("share-whatsapp").addEventListener("click", () => {
  if (!currentPosition) {
    showToast("Location not available yet");
    return;
  }

  const mapsLink = `https://www.google.com/maps?q=${currentPosition.lat},${currentPosition.lng}`;
  const message = `🚨 Emergency! I need help. My live location: ${mapsLink}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");
});

// Copy location link
document.getElementById("copy-location").addEventListener("click", () => {
  if (!currentPosition) {
    showToast("Location not available yet");
    return;
  }

  const mapsLink = `https://www.google.com/maps?q=${currentPosition.lat},${currentPosition.lng}`;

  navigator.clipboard.writeText(mapsLink)
    .then(() => showToast("Location link copied!"))
    .catch(() => showToast("Failed to copy"));
});

// Close button
document.getElementById("close-location").addEventListener("click", () => {
  closeModal("location-modal");
});

// Called automatically when SOS is triggered
function shareLocationEmergency() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

    // You can later send this to emergency contacts via backend
    console.log("Emergency Location:", mapsLink);
    showToast("Location captured for emergency");
  });
}
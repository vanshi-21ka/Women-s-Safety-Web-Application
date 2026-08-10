// ===== FAKE CALL FEATURE =====

let callInterval = null;
let callSeconds = 0;
let ringtone = null;

function startFakeCall() {
  // Reset
  callSeconds = 0;
  document.getElementById("call-timer").textContent = "00:00";
  document.getElementById("call-timer").classList.add("hidden");
  document.getElementById("end-call-btn").classList.add("hidden");
  document.querySelector(".call-actions").classList.remove("hidden");
  document.querySelector(".caller-info p").textContent = "Incoming call...";

  // Show modal
  openModal("fake-call-modal");

  // Play ringtone (simple beep using Web Audio API)
  playRingtone();
}

function playRingtone() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();

    function beep() {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    }

    // Ring pattern
    beep();
    setTimeout(beep, 1000);
    setTimeout(beep, 2000);
    setTimeout(beep, 3000);

    // Keep ringing every 4 seconds until answered
    ringtone = setInterval(() => {
      beep();
      setTimeout(beep, 1000);
    }, 4000);
  } catch (err) {
    console.log("Audio not supported");
  }
}

function stopRingtone() {
  if (ringtone) {
    clearInterval(ringtone);
    ringtone = null;
  }
}

// Accept Call
document.getElementById("accept-call").addEventListener("click", () => {
  stopRingtone();
  document.querySelector(".call-actions").classList.add("hidden");
  document.querySelector(".caller-info p").textContent = "Connected";
  document.getElementById("call-timer").classList.remove("hidden");
  document.getElementById("end-call-btn").classList.remove("hidden");

  // Start timer
  callInterval = setInterval(() => {
    callSeconds++;
    const mins = String(Math.floor(callSeconds / 60)).padStart(2, "0");
    const secs = String(callSeconds % 60).padStart(2, "0");
    document.getElementById("call-timer").textContent = `${mins}:${secs}`;
  }, 1000);
});

// Reject Call
document.getElementById("reject-call").addEventListener("click", () => {
  endFakeCall();
});

// End Call button
document.getElementById("end-call-btn").addEventListener("click", () => {
  endFakeCall();
});

function endFakeCall() {
  stopRingtone();
  if (callInterval) {
    clearInterval(callInterval);
    callInterval = null;
  }
  closeModal("fake-call-modal");
  showToast("Call ended");
}
// ===== EMERGENCY ALARM FEATURE =====

let alarmInterval = null;
let alarmAudioCtx = null;

function startAlarm() {
  // Show alarm modal
  openModal("alarm-modal");

  // Start loud alarm sound
  playAlarmSound();

  // Vibrate if supported
  if (navigator.vibrate) {
    // Vibrate pattern: vibrate 500ms, pause 200ms (repeat)
    navigator.vibrate([500, 200, 500, 200, 500, 200, 500]);
  }

  showToast("🚨 Alarm Activated!");
}

function playAlarmSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    alarmAudioCtx = new AudioContext();

    function createSiren() {
      const oscillator = alarmAudioCtx.createOscillator();
      const gainNode = alarmAudioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(alarmAudioCtx.destination);

      oscillator.type = "sawtooth";
      gainNode.gain.value = 0.4;

      // Siren effect - frequency sweep
      oscillator.frequency.setValueAtTime(600, alarmAudioCtx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(1200, alarmAudioCtx.currentTime + 0.5);
      oscillator.frequency.linearRampToValueAtTime(600, alarmAudioCtx.currentTime + 1);

      oscillator.start();
      oscillator.stop(alarmAudioCtx.currentTime + 1);
    }

    // Play siren immediately
    createSiren();

    // Keep repeating every 1.1 seconds
    alarmInterval = setInterval(() => {
      createSiren();
      // Also keep vibrating
      if (navigator.vibrate) {
        navigator.vibrate([400, 150]);
      }
    }, 1100);

  } catch (err) {
    console.log("Audio not supported on this device");
  }
}

function stopAlarm() {
  // Stop the repeating sound
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }

  // Close audio context
  if (alarmAudioCtx) {
    alarmAudioCtx.close();
    alarmAudioCtx = null;
  }

  // Stop vibration
  if (navigator.vibrate) {
    navigator.vibrate(0);
  }

  // Hide modal
  closeModal("alarm-modal");
  showToast("Alarm stopped");
}

// Stop Alarm button
document.getElementById("stop-alarm-btn").addEventListener("click", stopAlarm);
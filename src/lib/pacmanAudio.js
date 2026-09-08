let audioContext = null;

export async function playPacmanChomp(durationMs = 1450) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) return;

  if (!audioContext) audioContext = new AudioContext();
  if (audioContext.state === "suspended") await audioContext.resume();

  const ctx = audioContext;
  const start = ctx.currentTime;
  const duration = durationMs / 1000;
  const step = 0.11;

  for (let t = 0; t < duration; t += step) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "square";

    const high = Math.floor(t / step) % 2 === 0;
    const from = high ? 520 : 310;
    const to = high ? 310 : 520;

    oscillator.frequency.setValueAtTime(from, start + t);
    oscillator.frequency.exponentialRampToValueAtTime(
      to,
      start + t + step * 0.8,
    );

    gain.gain.setValueAtTime(0, start + t);
    gain.gain.linearRampToValueAtTime(0.035, start + t + 0.008);
    gain.gain.setValueAtTime(0.035, start + t + step * 0.65);
    gain.gain.linearRampToValueAtTime(0, start + t + step * 0.9);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(start + t);
    oscillator.stop(start + t + step);
  }
}
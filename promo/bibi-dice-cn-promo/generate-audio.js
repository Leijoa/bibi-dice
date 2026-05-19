const fs = require("fs");
const path = require("path");

const sampleRate = 44100;
const duration = 25;
const totalSamples = sampleRate * duration;
const channels = 2;
const pcm = Buffer.alloc(totalSamples * channels * 2);

function clamp(v) {
  return Math.max(-1, Math.min(1, v));
}

function env(t, start, length, attack = 0.02, release = 0.18) {
  const x = t - start;
  if (x < 0 || x > length) return 0;
  if (x < attack) return x / attack;
  if (x > length - release) return Math.max(0, (length - x) / release);
  return 1;
}

function kick(t, beat) {
  const e = env(t, beat, 0.42, 0.004, 0.36);
  if (!e) return 0;
  const f = 92 * Math.pow(0.45, (t - beat) * 4.2);
  return Math.sin(2 * Math.PI * f * (t - beat)) * e * 0.9;
}

function tick(t, beat, pan) {
  const e = env(t, beat, 0.07, 0.002, 0.06);
  if (!e) return [0, 0];
  const n = Math.sin(2 * Math.PI * 920 * t) + 0.5 * Math.sin(2 * Math.PI * 1840 * t);
  const v = n * e * 0.18;
  return [v * (1 - pan), v * (1 + pan)];
}

function pad(t, root, start, length) {
  const e = env(t, start, length, 1.2, 1.7);
  if (!e) return 0;
  const wobble = 1 + Math.sin(t * 0.7) * 0.004;
  return (
    Math.sin(2 * Math.PI * root * wobble * t) * 0.18 +
    Math.sin(2 * Math.PI * root * 1.5 * wobble * t) * 0.09 +
    Math.sin(2 * Math.PI * root * 2.01 * wobble * t) * 0.04
  ) * e;
}

function riser(t, start, length) {
  const x = (t - start) / length;
  if (x < 0 || x > 1) return 0;
  const e = Math.sin(Math.PI * x);
  const f = 180 + x * 980;
  return Math.sin(2 * Math.PI * f * t) * e * 0.16;
}

function hit(t, start) {
  const e = env(t, start, 0.75, 0.006, 0.62);
  if (!e) return 0;
  return (
    Math.sin(2 * Math.PI * 54 * (t - start)) * 0.55 +
    Math.sin(2 * Math.PI * 220 * (t - start)) * 0.22 +
    Math.sin(2 * Math.PI * 440 * (t - start)) * 0.12
  ) * e;
}

const beatStep = 0.5;
const sceneHits = [0.15, 5.5, 11, 16.5, 21.5];

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  let left = 0;
  let right = 0;

  const root = t < 11 ? 55 : t < 16.5 ? 61.74 : 49;
  const p = pad(t, root, 0, duration);
  left += p * 0.72;
  right += p * 0.78;

  for (let b = 0; b < duration; b += beatStep) {
    const pulse = kick(t, b);
    left += pulse * 0.33;
    right += pulse * 0.33;

    if (b % 1 !== 0) {
      const [tl, tr] = tick(t, b, Math.sin(b * 2.1) * 0.35);
      left += tl;
      right += tr;
    }
  }

  for (const h of sceneHits) {
    const v = hit(t, h);
    left += v * 0.85;
    right += v * 0.85;
  }

  left += riser(t, 14.8, 1.7) * 0.7;
  right += riser(t, 14.8, 1.7) * 0.7;
  left += riser(t, 20.2, 1.3) * 0.45;
  right += riser(t, 20.2, 1.3) * 0.45;

  const fadeIn = Math.min(1, t / 0.35);
  const fadeOut = Math.min(1, (duration - t) / 1.2);
  const master = 0.62 * fadeIn * fadeOut;
  left = clamp(left * master);
  right = clamp(right * master);

  pcm.writeInt16LE(Math.round(left * 32767), i * 4);
  pcm.writeInt16LE(Math.round(right * 32767), i * 4 + 2);
}

function chunk(id, data) {
  const buf = Buffer.alloc(8 + data.length);
  buf.write(id, 0, 4, "ascii");
  buf.writeUInt32LE(data.length, 4);
  data.copy(buf, 8);
  return buf;
}

const fmt = Buffer.alloc(16);
fmt.writeUInt16LE(1, 0);
fmt.writeUInt16LE(channels, 2);
fmt.writeUInt32LE(sampleRate, 4);
fmt.writeUInt32LE(sampleRate * channels * 2, 8);
fmt.writeUInt16LE(channels * 2, 12);
fmt.writeUInt16LE(16, 14);

const body = Buffer.concat([chunk("fmt ", fmt), chunk("data", pcm)]);
const header = Buffer.alloc(12);
header.write("RIFF", 0, 4, "ascii");
header.writeUInt32LE(body.length + 4, 4);
header.write("WAVE", 8, 4, "ascii");

const out = path.join(__dirname, "assets", "promo-score.wav");
fs.writeFileSync(out, Buffer.concat([header, body]));
console.log(out);

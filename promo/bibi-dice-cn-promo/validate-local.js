const fs = require("fs");
const path = require("path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const requiredFiles = [
  "assets/hero-dice.png",
  "assets/hero-dice-1080.png",
  "assets/relic-fusion.png",
  "assets/relic-fusion-1080.png",
  "assets/boss-shackle.png",
  "assets/boss-shackle-1080.png",
  "assets/promo-score.wav",
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
const clipRe = /id="([^"]+)"[^>]*data-start="([^"]+)"[^>]*data-duration="([^"]+)"[^>]*data-track-index="([^"]+)"/g;
const clips = [...html.matchAll(clipRe)].map((match) => ({
  id: match[1],
  start: Number(match[2]),
  duration: Number(match[3]),
  track: Number(match[4]),
  end: Number(match[2]) + Number(match[3]),
}));

const overlaps = [];
for (let i = 0; i < clips.length; i++) {
  for (let j = i + 1; j < clips.length; j++) {
    if (
      clips[i].track === clips[j].track &&
      clips[i].start < clips[j].end &&
      clips[j].start < clips[i].end
    ) {
      overlaps.push([clips[i].id, clips[j].id]);
    }
  }
}

const report = {
  missing,
  clipCount: clips.length,
  duration: Math.max(...clips.map((clip) => clip.end)),
  overlaps,
  hasTimeline: html.includes('window.__timelines["bibi-dice-promo"] = tl'),
  hasAudio: html.includes("promo-score.wav"),
};

console.log(JSON.stringify(report, null, 2));

if (
  missing.length > 0 ||
  overlaps.length > 0 ||
  report.duration !== 25 ||
  !report.hasTimeline ||
  !report.hasAudio
) {
  process.exit(1);
}

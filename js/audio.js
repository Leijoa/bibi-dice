// js/audio.js
let audioCtx = null;
export let sfxVolume = 0.5;
export let bgmVolume = 0.5;
export let bgmMuted = false;
export let sfxMuted = false;

let bgmBuffers = {};
let currentBGMNode = null;
let currentBGMGain = null;
let currentBGMTrackId = null;

let sfxBuffers = {};
let sfxLastPlayed = {}; // 冷卻時間用

async function loadSFX(name, url) {
    if (sfxBuffers[name]) return;
    try {
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        sfxBuffers[name] = await audioCtx.decodeAudioData(buf);
    } catch(e) {
        console.warn(`SFX load failed (${name}):`, e);
    }
}

// 播放已載入的 SFX buffer，cooldownSec 防止短時間重疊觸發
function playSFXBuffer(name, vol = 1.0, cooldownSec = 0, onended = null) {
    if (sfxMuted || sfxVolume <= 0 || !audioCtx || !sfxBuffers[name]) return false;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    if (cooldownSec > 0 && sfxLastPlayed[name] && now - sfxLastPlayed[name] < cooldownSec) return true;
    sfxLastPlayed[name] = now;
    const src = audioCtx.createBufferSource();
    src.buffer = sfxBuffers[name];
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(Math.min(vol * sfxVolume, 1), now);
    src.connect(gain);
    gain.connect(audioCtx.destination);
    src.start();
    if (onended) src.onended = onended;
    return true;
}

export function setBGMMute(muted) {
    bgmMuted = muted;
    if (currentBGMGain && audioCtx) {
        currentBGMGain.gain.cancelScheduledValues(audioCtx.currentTime);
        currentBGMGain.gain.setValueAtTime(currentBGMGain.gain.value, audioCtx.currentTime);
        const targetVol = bgmMuted ? 0 : (currentBGMTrackId === '02' ? bgmVolume * 0.8 : bgmVolume);
        currentBGMGain.gain.linearRampToValueAtTime(targetVol, audioCtx.currentTime + 0.1);
    }
}

export function setSFXMute(muted) {
    sfxMuted = muted;
}

export function setSFXVolume(vol) {
    sfxVolume = Math.max(0, Math.min(1, vol));
}

export function setBGMVolume(vol) {
    bgmVolume = Math.max(0, Math.min(1, vol));
    if (currentBGMGain && audioCtx && !bgmMuted) {
        currentBGMGain.gain.cancelScheduledValues(audioCtx.currentTime);
        currentBGMGain.gain.setValueAtTime(currentBGMGain.gain.value, audioCtx.currentTime);
        const targetVol = currentBGMTrackId === '02' ? bgmVolume * 0.8 : bgmVolume;
        currentBGMGain.gain.linearRampToValueAtTime(targetVol, audioCtx.currentTime + 0.1);
    }
}

export function playTitleSound() {
    if (!audioCtx) initAudio();
    const afterSFX = () => playBGMTrack('title');
    if (!sfxBuffers['bibiTitle']) {
        loadSFX('bibiTitle', 'sfx/bibi_title.mp3').then(() => {
            playSFXBuffer('bibiTitle', 0.8, 0, afterSFX);
        });
    } else {
        playSFXBuffer('bibiTitle', 0.8, 0, afterSFX);
    }
}

export function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    pauseBGM();
                } else {
                    playBGM();
                }
            });
            loadBGM('01', 'bgm/bibbidiba_BGM_01.mp3');
            loadBGM('02', 'bgm/bibbidiba_BGM_02.mp3');
            loadBGM('title', 'bgm/bibi_title_bgm.mp3');
            loadSFX('dice', 'sfx/dice.mp3');
            loadSFX('attack', 'sfx/attack.mp3');
            loadSFX('bibiTitle', 'sfx/bibi_title.mp3');
        }
    } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

async function loadBGM(trackId, url) {
    if (bgmBuffers[trackId]) return; // Already loaded
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        bgmBuffers[trackId] = audioBuffer;
    } catch (e) {
        console.warn(`Failed to load BGM ${trackId}:`, e);
    }
}

export function playBGMTrack(trackId) {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (currentBGMTrackId === trackId) return; // Already playing

    const fadeOutDuration = 1.5;
    const fadeInDuration = 1.5;

    // Fade out current BGM
    if (currentBGMGain && currentBGMNode) {
        const prevGain = currentBGMGain;
        const prevNode = currentBGMNode;
        prevGain.gain.setValueAtTime(prevGain.gain.value, audioCtx.currentTime);
        prevGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + fadeOutDuration);

        setTimeout(() => {
            try { prevNode.stop(); } catch(e){}
            prevNode.disconnect();
            prevGain.disconnect();
        }, fadeOutDuration * 1000 + 100);
    }

    currentBGMTrackId = trackId;
    currentBGMNode = null;
    currentBGMGain = null;

    if (!bgmBuffers[trackId]) {
        // If not loaded yet, try to load and play
        const bgmUrls = {'01':'bgm/bibbidiba_BGM_01.mp3','02':'bgm/bibbidiba_BGM_02.mp3','title':'bgm/bibi_title_bgm.mp3'};
        loadBGM(trackId, bgmUrls[trackId] || `bgm/bibbidiba_BGM_${trackId}.mp3`).then(() => {
            if (currentBGMTrackId === trackId) startBGMPlayback(trackId, fadeInDuration);
        });
    } else {
        startBGMPlayback(trackId, fadeInDuration);
    }
}

function startBGMPlayback(trackId, fadeInDuration) {
    if (!bgmBuffers[trackId] || !audioCtx) return;

    currentBGMNode = audioCtx.createBufferSource();
    currentBGMNode.buffer = bgmBuffers[trackId];
    currentBGMNode.loop = true;

    currentBGMGain = audioCtx.createGain();
    currentBGMGain.gain.setValueAtTime(0, audioCtx.currentTime);

    const targetVol = bgmMuted ? 0 : (trackId === '02' ? bgmVolume * 0.8 : bgmVolume);
    currentBGMGain.gain.linearRampToValueAtTime(targetVol, audioCtx.currentTime + fadeInDuration);

    currentBGMNode.connect(currentBGMGain);
    currentBGMGain.connect(audioCtx.destination);

    currentBGMNode.start();
}

export function playBGM() {
    // Legacy support, default to 01 if none playing
    if (!currentBGMTrackId) {
        playBGMTrack('01');
    } else if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

export function pauseBGM() {
    if (audioCtx && audioCtx.state === 'running') {
        audioCtx.suspend();
    }
}

function playTone(freq, type, duration, vol=0.1) {
    if (sfxMuted || sfxVolume <= 0 || !audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Scale the base volume by the user's SFX volume setting
    const finalVol = vol * sfxVolume;
    gainNode.gain.setValueAtTime(finalVol, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

export function playRollSound() {
    if (sfxMuted || sfxVolume <= 0) return;
    // 180ms 冷卻避免 15 幀動畫疊爆；MP3 優先，否則合成音
    if (playSFXBuffer('dice', 0.75, 0.18)) return;
    playTone(600 + Math.random()*200, 'square', 0.02, 0.05);
}

export function playAttackSound() {
    if (sfxMuted || sfxVolume <= 0) return;
    // 按鈕即時回饋：只播合成衝擊音
    // MP3 劍擊聲由 playAttackImpactSound() 在分數動畫結尾觸發
    playTone(150, 'sawtooth', 0.2, 0.2);
    setTimeout(() => playTone(100, 'square', 0.3, 0.3), 50);
}

// 分數動畫最後一步完成後落地的劍擊聲（MP3）
export function playAttackImpactSound() {
    if (sfxMuted || sfxVolume <= 0) return;
    playSFXBuffer('attack', 0.85);
}

export function playBuySound() {
    if (sfxMuted || sfxVolume <= 0) return;
    // Chime
    playTone(800, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(1200, 'sine', 0.2, 0.1), 100);
}

export function playClickSound() {
    if (sfxMuted || sfxVolume <= 0) return;
    playTone(400, 'sine', 0.05, 0.05);
}

export function playScoreStepSound(stepCount, isFinal = false) {
    if (sfxMuted || sfxVolume <= 0) return;

    if (isFinal) {
        // 結算完成時的清脆高音 (8-bit 勝利感)
        playTone(880, 'square', 0.1, 0.1);
        setTimeout(() => playTone(1760, 'square', 0.3, 0.15), 80);
    } else {
        // 隨著步驟疊加，音調越來越高 (基礎 400Hz，每步增加 80Hz)
        let freq = 400 + (stepCount * 80);
        // 限制最高音頻避免刺耳
        freq = Math.min(freq, 1200);
        playTone(freq, 'square', 0.06, 0.08);
    }
}

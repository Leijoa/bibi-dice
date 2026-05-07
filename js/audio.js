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

export function setBGMMute(muted) {
    bgmMuted = muted;
    if (currentBGMGain && audioCtx) {
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
        const targetVol = currentBGMTrackId === '02' ? bgmVolume * 0.8 : bgmVolume;
        currentBGMGain.gain.linearRampToValueAtTime(targetVol, audioCtx.currentTime + 0.1);
    }
}

export function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
            loadBGM('01', 'bibbidiba_BGM_01.wav');
            loadBGM('02', 'bibbidiba_BGM_02.wav');
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
        loadBGM(trackId, `bibbidiba_BGM_${trackId}.wav`).then(() => {
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
    // Rapid tick for rolling
    playTone(600 + Math.random()*200, 'square', 0.02, 0.05);
}

export function playAttackSound() {
    if (sfxMuted || sfxVolume <= 0) return;
    // Impact sound
    playTone(150, 'sawtooth', 0.2, 0.2);
    setTimeout(() => playTone(100, 'square', 0.3, 0.3), 50);
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

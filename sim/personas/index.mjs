// sim/personas/index.mjs
// 人格註冊表（五人格完整版）。
// novice 新手小白 / casual 休閒 / veteran 老手 / gambler 賭徒 / theorist 理論派（上限基準）

import { createNovice } from './novice.mjs';
import { createCasual } from './casual.mjs';
import { createVeteran } from './veteran.mjs';
import { createGambler } from './gambler.mjs';
import { createTheorist } from './theorist.mjs';

export function createPersona(name, options = {}) {
    switch (name) {
        case 'novice': return createNovice(options);
        case 'casual': return createCasual(options);
        case 'veteran': return createVeteran(options);
        case 'gambler': return createGambler(options);
        case 'theorist': return createTheorist(options);
        default: throw new Error(`未知人格：${name}（支援 novice, casual, veteran, gambler, theorist）`);
    }
}

export const AVAILABLE_PERSONAS = ['novice', 'casual', 'veteran', 'gambler', 'theorist'];

const DEFAULT_DICE_FILES = ['dice_0.webp', 'dice_1.webp', 'dice_2.webp', 'dice_3.webp', 'dice_4.webp', 'dice_5.webp', 'dice_6.webp', 'dice_7.webp', 'dice_8.webp'];

const DICE_SKINS = {
  default: {
    path: 'img/skins/default/',
    files: DEFAULT_DICE_FILES
  },
  rainbow: {
    path: 'img/skins/default/',
    files: DEFAULT_DICE_FILES,
    filters: [
      '',
      'hue-rotate(135deg) saturate(1.55) contrast(1.35) brightness(0.95)',
      'hue-rotate(165deg) saturate(1.45) contrast(1.4)',
      'hue-rotate(185deg) saturate(1.5) contrast(1.4) brightness(1.08)',
      'hue-rotate(0deg) saturate(1.35) contrast(1.4)',
      'hue-rotate(45deg) saturate(1.45) contrast(1.4) brightness(0.98)',
      'grayscale(1) contrast(1.6) brightness(1.2)',
      'hue-rotate(270deg) saturate(1.5) contrast(1.45) brightness(0.9)',
      'hue-rotate(300deg) saturate(1.45) contrast(1.4) brightness(0.95)'
    ]
  }
};

export function getDiceSkinId() {
  const storedSkin = localStorage.getItem('diceSkin') || 'default';
  return DICE_SKINS[storedSkin] ? storedSkin : 'default';
}

export function setDiceSkin(skinId) {
  if (!DICE_SKINS[skinId]) return false;
  localStorage.setItem('diceSkin', skinId);
  return true;
}

export function getDiceImageUrl(value) {
  const skin = DICE_SKINS[getDiceSkinId()];
  const idx = (value >= 0 && value <= 8) ? value : 0;
  return skin.path + skin.files[idx];
}

export function getDiceImageFilter(value) {
  const skin = DICE_SKINS[getDiceSkinId()];
  const idx = (value >= 1 && value <= 8) ? value : 0;
  return skin.filters ? skin.filters[idx] : '';
}

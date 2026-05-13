const DICE_SKINS = {
  default: {
    name: '藍晶骰',
    path: 'img/skins/default/',
    files: ['dice_0.webp','dice_1.webp','dice_2.webp','dice_3.webp','dice_4.webp','dice_5.webp','dice_6.webp','dice_7.webp','dice_8.webp'],
  }
};

let currentDiceSkin = localStorage.getItem('diceSkin') || 'default';

function getDiceImageUrl(value) {
  const skin = DICE_SKINS[currentDiceSkin] || DICE_SKINS.default;
  const idx = (value >= 0 && value <= 8) ? value : 0;
  return skin.path + skin.files[idx];
}

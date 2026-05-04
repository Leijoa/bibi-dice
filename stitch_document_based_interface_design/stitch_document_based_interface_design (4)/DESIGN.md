---
name: Abyssal Arcane
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#7a3bf5'
  on-primary-container: '#eee4ff'
  inverse-primary: '#702ceb'
  secondary: '#fff9ef'
  on-secondary: '#3a3000'
  secondary-container: '#ffdb3c'
  on-secondary-container: '#725f00'
  tertiary: '#00dbe9'
  on-tertiary: '#00363a'
  tertiary-container: '#00747c'
  on-tertiary-container: '#a0f7ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5600c9'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#7df4ff'
  tertiary-fixed-dim: '#00dbe9'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  title-hero:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  title-section:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  stats-xl:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.02em
  body-main:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  safe-zone: 32px
  panel-gap: 20px
---

## Brand & Style

This design system establishes a visual language of "Gothic Futurism"—a synthesis of ancient, heavy mysticism and sharp, high-stakes tactical clarity. The brand personality is enigmatic and unforgiving, yet rewards mastery with opulent visual feedback. 

The design style leans heavily into **Tactile Skeuomorphism** combined with **Glassmorphism**. UI elements feel physically heavy, utilizing stone textures and weathered metal, while overlays utilize ethereal, semi-transparent blurs to represent the shifting nature of magic. The emotional response should be one of focused tension; players should feel like they are interacting with a dangerous, sentient artifact that pulses with power.

## Colors

The palette is anchored by "Abyssal Void" and "Deep Amethyst," creating a canvas of low-luminance purples and blacks. This ensures that the "Neon Arcane" accents—gold, crimson, and ethereal blue—vibrate against the dark background.

- **Primary (Amethyst/Purple):** Used for magical resonance, mana indicators, and active ability highlights.
- **Secondary (Gold):** Reserved exclusively for rarity, legendary items, and wealth.
- **Tertiary (Ethereal Blue):** Dedicated to soul collection, experience points, and ghostly UI transitions.
- **Status Red:** High-saturation crimson used for health bars and lethal damage warnings.

## Typography

The typographic hierarchy balances flavor and function. Titles utilize **Newsreader** for its literary, medieval-serif quality, evoking ancient grimoires. These should often be styled with a subtle outer glow or gold gradient.

For gameplay-critical data, **Space Grotesk** provides a technical, high-readability feel that cuts through the chaos of combat. **Manrope** is used for narrative descriptions and tooltips, providing a modern, refined legibility that prevents eye strain during long sessions.

## Layout & Spacing

This design system uses a **Fixed Grid** model for menus and a **Safe-Margin** HUD layout for combat. The screen is divided into tactical zones: the "Abyssal Floor" (bottom HUD) and "Celestial Crowns" (top corners for stats).

A strict 4px baseline grid ensures alignment across complex stone panels. Gutters between inventory slots are tight (4px) to maximize screen real estate, while main UI panels are separated by 20px gaps to allow the background game world to remain visible, reinforcing the high-stakes immersion.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Luminescent Borders**. 
1. **The Void (Background):** Pure black or deep purple blurred game world.
2. **The Slate (Base Layer):** Dark, stone-textured panels with 40% opacity.
3. **The Sigil (Interactive Layer):** High-opacity panels with glowing inner-shadows.
4. **The Arcane (Overlay):** Full-saturation modal windows with "Soul Blue" backdrop blurs.

Shadows are not neutral; they are "Negative Glows" using deep purples with a 20px blur to suggest that UI elements are floating in a thick, magical atmosphere.

## Shapes

The shape language is **Sharp (0)**. This design system avoids soft curves in favor of aggressive, angular geometry reminiscent of cut gemstones and obelisks. 

Beveled edges and 45-degree corner cuts are used for buttons and panels. Decorative elements should feature "broken" stone aesthetics—jagged edges and runic etchings that break the silhouette of the rectangles to add organic, ancient character.

## Components

### Buttons & Interactive Sigils
Buttons are stone slabs with beveled edges. The "Default" state is dark grey stone; the "Hover" state triggers a purple runic glow from within the cracks of the stone; the "Active/Click" state flashes the secondary gold color.

### Dice Components
Tactile, 3D-rendered hexagonal or polyhedral shapes. They use high-contrast white-on-black or gold-on-purple numbers. When "rolling," they should emit particle trails of Ethereal Blue.

### Stone-Textured Panels
Main containers for inventory and character sheets. They feature ornate corner brackets (gold) and glowing rune-lines that trace the perimeter of the panel.

### Ornate Borders & Chips
Status effects are displayed in diamond-shaped chips. Rarity is indicated by the complexity of the border: a "Common" item has a simple stone frame, while a "Legendary" item has a pulsing gold frame with floating particle effects.

### Health & Mana Orbs
Traditional circular reservoirs at the screen corners, utilizing a heavy "liquid" shader. The health orb (Crimson) should thicken and darken as health drops, appearing like drying blood.
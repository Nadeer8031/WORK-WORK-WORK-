---
name: Aurelian Health
colors:
  surface: '#fff8f8'
  surface-dim: '#e2d7d8'
  surface-bright: '#fff8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf1f2'
  surface-container: '#f6ebec'
  surface-container-high: '#f1e6e6'
  surface-container-highest: '#ebe0e1'
  on-surface: '#1f1a1b'
  on-surface-variant: '#514346'
  inverse-surface: '#352f30'
  inverse-on-surface: '#f9eeef'
  outline: '#837376'
  outline-variant: '#d5c2c5'
  surface-tint: '#844f5d'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#350e1b'
  on-primary-container: '#ae7382'
  inverse-primary: '#f7b4c4'
  secondary: '#605e58'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfd7'
  on-secondary-container: '#64635c'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#241a0e'
  on-tertiary-container: '#928170'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e0'
  primary-fixed-dim: '#f7b4c4'
  on-primary-fixed: '#350e1b'
  on-primary-fixed-variant: '#683845'
  secondary-fixed: '#e5e2da'
  secondary-fixed-dim: '#c9c6bf'
  on-secondary-fixed: '#1c1c17'
  on-secondary-fixed-variant: '#484741'
  tertiary-fixed: '#f4dfcb'
  tertiary-fixed-dim: '#d7c3b0'
  on-tertiary-fixed: '#241a0e'
  on-tertiary-fixed-variant: '#524436'
  background: '#fff8f8'
  on-background: '#1f1a1b'
  surface-variant: '#ebe0e1'
typography:
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The brand personality centers on "Reliable Sophistication." This design system bridges the gap between high-end cabinetry and precision medical technology. It targets health-conscious professionals who value both aesthetic integration and clinical accuracy. 

The design style is **Corporate / Modern** with a **Minimalist** ethos. It utilizes heavy whitespace to reduce cognitive load—essential for medical management—and employs a "Quiet Luxury" aesthetic. The emotional response is one of calm, professional assurance, moving away from the cold sterility of traditional hospitals toward a warm, domestic health sanctuary.

## Colors
The palette is rooted in an organic, high-contrast spectrum designed for maximum legibility and premium feel. 

- **Primary (#340D1A):** Used for key brand moments, primary actions, and high-level headings. It provides the "authority" of the brand.
- **Background (#F6F3E8):** The foundational canvas. This off-white/cream reduces eye strain compared to pure white and enhances the "lifestyle" feel of the product.
- **Secondary (#DFDCD4):** Employed for structural elements like dividers, borders, and disabled states.
- **Accent/Neutral (#B5A391):** Used for metadata, secondary labels, and soft iconography to maintain a grounded, earthy tone.

## Typography
This design system utilizes a traditional/modern pairing. **Source Serif 4** provides the authoritative, literary voice required for medical trust. **Hanken Grotesk** offers a sharp, contemporary sans-serif counterpart for data-heavy views and interface controls.

Large headlines should use the Primary color to anchor the page. Body text should maintain high contrast against the Cream background using a dark charcoal or the Primary color at high opacity.

## Layout & Spacing
The system employs a **Fixed Grid** for desktop and a **Fluid Grid** for mobile devices. 

- **Desktop:** 12-column grid with 24px gutters. Content is centered with a max-width of 1200px to prevent excessive line lengths.
- **Mobile:** 4-column fluid grid with 16px gutters and 20px side margins.
- **Rhythm:** An 8px linear scale (8, 16, 24, 32, 48, 64) is used for all padding and margins to ensure a consistent vertical rhythm. Generous padding (minimum 24px) should be applied to cards and containers to maintain the "premium" airy feel.

## Elevation & Depth
To reflect a high-end medical device, hierarchy is communicated through **Ambient Shadows** and **Tonal Layers**. 

Surfaces use very soft, diffused shadows (Blur: 20px, Spread: 0, Opacity: 4%) with a subtle tint of the Primary color to add warmth. Elevated components like modals or active medication cards should appear to float slightly above the #F6F3E8 base. Lower-level depth is achieved through 1px borders in the Secondary (#DFDCD4) color rather than shadows, keeping the UI crisp and professional.

## Shapes
The shape language is **Soft**. A 4px (0.25rem) base radius is used for most UI components (inputs, small buttons) to maintain a precise, clinical feel. Larger containers like medicine cabinet "bins" or informational cards use an 8px (0.5rem) or 12px (0.75rem) radius to feel more approachable and ergonomic. This balance ensures the product feels like a piece of high-quality furniture rather than a generic plastic gadget.

## Components
- **Buttons:** Primary buttons are solid #340D1A with white text. Secondary buttons use a #DFDCD4 border with Primary text. Transitions should be slow and deliberate (250ms).
- **Cards:** White or Cream backgrounds with a 1px #DFDCD4 border. On hover, apply the ambient shadow.
- **Inputs:** Clean, 1px bordered boxes using #B5A391 for labels. Focus states should use a subtle 2px Primary color underline or border.
- **Chips/Status:** Used for dosage status (e.g., "Taken," "Missed"). Use low-saturation variants of green/red, but keep the text in Primary for readability.
- **Medication Lists:** High-contrast rows with 16px vertical padding. Use the Serif font for the medication name and Sans-serif for dosage instructions.
- **Inventory Gauge:** A custom component showing remaining pills, utilizing a thin, elegant progress bar in #340D1A against a #DFDCD4 track.
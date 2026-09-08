---
name: Silk & Stone
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#404847'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#717977'
  outline-variant: '#c0c8c6'
  surface-tint: '#3c6660'
  primary: '#002421'
  on-primary: '#ffffff'
  primary-container: '#0d3b36'
  on-primary-container: '#7aa59e'
  inverse-primary: '#a3cfc8'
  secondary: '#765a26'
  on-secondary: '#ffffff'
  secondary-container: '#fed797'
  on-secondary-container: '#795c28'
  tertiary: '#470014'
  on-tertiary: '#ffffff'
  tertiary-container: '#6f0023'
  on-tertiary-container: '#fe6d85'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bfece4'
  primary-fixed-dim: '#a3cfc8'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#234e48'
  secondary-fixed: '#ffdeaa'
  secondary-fixed-dim: '#e6c183'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5c4210'
  tertiary-fixed: '#ffd9dc'
  tertiary-fixed-dim: '#ffb2ba'
  on-tertiary-fixed: '#400011'
  on-tertiary-fixed-variant: '#8b1433'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Vazirmatn
    fontSize: 42px
    fontWeight: '700'
    lineHeight: 62px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Vazirmatn
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 48px
  headline-md:
    fontFamily: Vazirmatn
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 42px
  headline-sm:
    fontFamily: Vazirmatn
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 34px
  body-lg:
    fontFamily: Vazirmatn
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Vazirmatn
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
  label-md:
    fontFamily: Vazirmatn
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  price-lg:
    fontFamily: Vazirmatn
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system is built for a premium Persian e-commerce experience that balances high-end editorial aesthetics with rigorous functional clarity. The brand personality is **sophisticated, serene, and authoritative**, moving away from the heavy dark modes of generic tech to a "Gallery" approach—where the interface acts as a minimalist frame for high-quality products.

### Design Movement: Modern Minimalist + Tonal Depth
The system utilizes a **Minimalist** foundation with **Tactile** elevation. It prioritizes expansive whitespace (Light & Airy) to evoke a sense of luxury. Unlike flat minimalism, this system uses ultra-soft, realistic shadows to ground products in 3D space, creating a "boutique" feel rather than a "supermarket" one.

### Emotional Response
- **Trust:** Established through precise alignment and the use of the authoritative Vazirmatn typeface.
- **Exclusivity:** Achieved through generous margins and a restrained color palette.
- **Ease:** A seamless RTL flow that feels native and unhurried.

## Colors

The palette is anchored by **Deep Emerald (#0D3B36)**, representing stability and premium quality. This is paired with **Champagne Gold (#C5A267)** for subtle accents and high-tier highlights.

- **Primary:** Deep Emerald. Used for primary CTAs, headers, and active states.
- **Secondary/Accent:** Champagne Gold. Used for loyalty badges, ratings, and premium iconography.
- **Semantic Neutral:** A range of soft grays (from #F8F9FA to #2D3436) ensures the UI never feels "stark" black/white, maintaining a softer, light-filled atmosphere.
- **Surface:** The primary background is a very faint "Off-White" (#FCFCFC) to reduce eye strain compared to pure white.

## Typography

The system exclusively uses **Vazirmatn** to ensure a cohesive, legible, and modern Persian reading experience. 

- **Numerals:** Always use Persian numerals (۱۲۳) for price and quantities to maintain cultural integrity.
- **Rhythm:** Line heights are slightly taller than standard Latin settings (approx 1.5x - 1.6x) to accommodate the ascenders and descenders of the Persian script without crowding.
- **Visual Weight:** Headlines utilize 'Bold' or 'SemiBold' for clear hierarchy, while body text remains 'Regular' for maximum legibility in long product descriptions.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid grid**. 
- **Desktop:** 12-column grid with a 1280px max-width, centered.
- **Gutter:** 24px wide to allow the "airy" feel between product cards.
- **Asymmetric Hero:** The landing page uses an asymmetric split—product imagery takes up 60% of the width with floating 3D elements, while text and CTA are anchored in the remaining 40%.

**RTL Logic:** All layouts are mirrored. Sidebars for the Admin UI appear on the right. Breadcrumbs and carousels move from right to left.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** rather than lines.

- **Level 1 (Base):** Subtle 1px border (#F0F0F0) for inputs and inactive states.
- **Level 2 (Product Cards):** A "Soft Floor" shadow. A dual-shadow stack (one wide/diffused, one tight/darker) to make products appear as if they are sitting on a physical surface.
- **Level 3 (Modals/Admin Panels):** High elevation with a 15% opacity primary-tinted shadow (Deep Emerald tint) to create a sense of floating focus.
- **3D Grounding:** Product images should ideally include a "contact shadow" at the base of the object to separate it from the flat card background.

## Shapes

The design system uses **Rounded (0.5rem / 8px)** as the base radius. This provides a professional yet approachable feel. 

- **Standard Elements:** Buttons and Input fields use the 8px radius.
- **Large Elements:** Product cards and hero banners use `rounded-xl` (24px) to create a softer, more premium "container" look.
- **Badges:** Discount tags and small labels use a full pill-shape to distinguish them from interactive buttons.

## Components

### Premium Product Cards
Cards feature a "Ghost" style. No heavy borders; instead, they use a subtle background change on hover (#FDFDFD to #F8F9FA) and an increased shadow depth. The "Add to Cart" button only appears or gains full opacity on hover to reduce visual clutter.

### Admin UI (Information Dense)
The Admin panel uses a "Tiled" layout. Each data set (Orders, Revenue, Inventory) is housed in a clean white tile with a subtle Level 1 elevation. Text sizes are reduced to `label-md` for data tables to maximize information density while maintaining legibility through Vazirmatn Medium.

### Buttons
- **Primary:** Solid Deep Emerald with white text. High-end matte finish (no gradients).
- **Secondary:** Outlined Deep Emerald or Champagne Gold for "View Details."
- **Ghost:** Used for utility actions like "Compare" or "Wishlist."

### Pricing & Currency
Prices are displayed as `[Amount] تومان`. The word "تومان" should be 30% smaller than the numeral and set in a slightly lighter weight (Medium vs Bold).
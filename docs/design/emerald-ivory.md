---
name: Emerald & Ivory
colors:
  surface: '#f8faf7'
  surface-dim: '#d9dad8'
  surface-bright: '#f8faf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f2'
  surface-container: '#edeeec'
  surface-container-high: '#e7e9e6'
  surface-container-highest: '#e1e3e1'
  on-surface: '#191c1b'
  on-surface-variant: '#404943'
  inverse-surface: '#2e3130'
  inverse-on-surface: '#f0f1ef'
  outline: '#707972'
  outline-variant: '#c0c9c0'
  surface-tint: '#2d694c'
  primary: '#2d694c'
  on-primary: '#ffffff'
  primary-container: '#8bc9a5'
  on-primary-container: '#165539'
  inverse-primary: '#96d4af'
  secondary: '#2c6859'
  on-secondary: '#ffffff'
  secondary-container: '#afecd8'
  on-secondary-container: '#316d5d'
  tertiary: '#8c4b50'
  on-tertiary: '#ffffff'
  tertiary-container: '#f8a6aa'
  on-tertiary-container: '#75393e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b1f1cb'
  primary-fixed-dim: '#96d4af'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#105135'
  secondary-fixed: '#b1efdb'
  secondary-fixed-dim: '#96d3bf'
  on-secondary-fixed: '#002019'
  on-secondary-fixed-variant: '#0d5041'
  tertiary-fixed: '#ffdada'
  tertiary-fixed-dim: '#ffb3b6'
  on-tertiary-fixed: '#390a10'
  on-tertiary-fixed-variant: '#703439'
  background: '#F7F7F2'
  on-background: '#191c1b'
  surface-variant: '#e1e3e1'
  card-bg: '#FFFFFF'
  text-secondary: '#6B756F'
  border: '#E2E7E3'
typography:
  display-lg:
    fontFamily: Vazirmatn
    fontSize: 42px
    fontWeight: '700'
    lineHeight: 62px
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
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1280px
---

## Brand & Style

This design system is a high-end editorial framework designed for a premium Persian e-commerce experience. The brand personality is **sophisticated, serene, and authoritative**, emphasizing a "Gallery" approach where the interface serves as a minimalist frame for curated products. It balances a professional demeanor with an inviting, tactile warmth.

### Design Movement: Modern Minimalist + Tonal Depth
The system merges **Minimalism** with **Tactile** elevation. It utilizes expansive whitespace to evoke luxury while employing a sophisticated shadow system to ground elements in 3D space. The aesthetic avoids the starkness of pure digital flat design, opting instead for a "boutique" atmosphere that feels physical and high-value.

### Emotional Response
- **Trust:** Established through the authoritative Vazirmatn typeface and precise, grid-based alignment.
- **Exclusivity:** Achieved through generous margins and a refined, restrained color palette.
- **Ease:** A seamless RTL flow that feels native, intuitive, and unhurried.

## Colors

The color palette is anchored by organic, earthy tones that reinforce a premium, sustainable, and high-end aesthetic.

- **Primary (Accent/CTA):** #8BC9A5. A soft, luminous green used for primary actions, highlights, and key brand touchpoints.
- **Secondary:** #2F6B5B. A deep, forest green used for headers, secondary navigation, and grounding structural elements.
- **Background:** #F7F7F2. A warm ivory that replaces sterile white to reduce eye strain and provide a "gallery" paper-like feel.
- **Typography:** The primary text (#171A19) provides high contrast without the harshness of pure black, while #6B756F serves as a softer secondary tier for metadata and descriptions.
- **Borders:** #E2E7E3. A low-contrast green-tinted gray used for structural definition and subtle separation.

## Typography

The design system exclusively uses **Vazirmatn** to ensure a cohesive and modern Persian reading experience.

- **RTL Logic:** Typography is optimized for Right-to-Left flow. All alignments, bullet points, and icon-text pairings must respect this direction.
- **Numerals:** Always use Persian numerals (۱۲۳) for prices and quantities to maintain cultural and aesthetic integrity.
- **Line Heights:** Set to approximately 1.5x–1.6x the font size. This extra breathing room prevents the tall ascenders and descenders of the Persian script from feeling crowded.
- **Hierarchy:** Headlines use SemiBold or Bold weights to command attention, while body text remains Regular to ensure maximum legibility for product descriptions and long-form content.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid grid** model specifically optimized for RTL reading patterns.

- **Grid System:** A 12-column grid for desktop with a maximum content width of 1280px.
- **Gutter & Margins:** Generous 24px gutters ensure an "airy" feel. Desktop margins are set to 48px to frame the content, while mobile scales down to 16px.
- **RTL Reflow:** Sidebars, navigation menus, and content carousels must mirror their standard LTR positions (e.g., sidebars on the right, back buttons pointing right).
- **Asymmetric Hero:** Landing pages utilize an asymmetric split where product imagery occupies 60% of the viewport with floating 3D elements, while text and CTA are anchored in the remaining 40%.

## Elevation & Depth

This design system uses a sophisticated shadow hierarchy to create a pronounced 3D effect, making elements feel like physical objects on a surface.

- **Level 1 (Base):** Subtle 1px border (#E2E7E3) for inactive inputs or structural dividers.
- **Level 2 (Cards):** A multi-layered shadow stack. One wide, very soft, low-opacity shadow (10% opacity of #2F6B5B) and one tighter, darker shadow to simulate "contact" with the background.
- **Level 3 (Interactive/Hover):** On hover, cards should lift. The shadow becomes more diffused and the blur radius increases, enhancing the 3D depth.
- **Level 4 (Modals):** High-elevation shadows with a 15% opacity tint of the Secondary Green to create a sense of floating focus.
- **Visual Grounding:** Product images within cards should utilize a natural "contact shadow" at their base to separate the object from the card background.

## Shapes

The shape language is **Rounded**, balancing professional precision with an approachable, organic feel.

- **Base Radius:** 0.5rem (8px) for buttons, input fields, and standard UI elements.
- **Container Radius:** 1.5rem (24px) for product cards, hero banners, and large structural blocks to emphasize the premium "soft-touch" aesthetic.
- **Pill Shapes:** Used exclusively for tags, badges (like discounts), and specific utility chips to distinguish them from actionable buttons.

## Components

### Premium Product Cards
Cards are the centerpiece of the experience. They feature a white background (#FFFFFF) against the ivory page background (#F7F7F2). They should not have heavy borders; instead, they rely on the enhanced 3D shadow system. Interactive elements like "Quick View" or "Add to Cart" should fade in on hover to keep the interface clean.

### Buttons
- **Primary Action:** Solid #8BC9A5 with #171A19 text. It uses a matte finish with no gradients.
- **Secondary/Outline:** Outlined #2F6B5B with #2F6B5B text for less urgent actions.
- **Ghost/Utility:** Subtle text-only buttons for actions like "Wishlist" or "Compare," using the secondary text color.

### Input Fields
Inputs use a white background with a #E2E7E3 border. On focus, the border transitions to #8BC9A5 with a subtle outer glow (soft shadow) to indicate activity.

### Pricing & Currency
Prices are set in `price-lg`. The word "تومان" (Toman) should be styled 30% smaller than the numeric value and set in a slightly lighter weight (Medium) to ensure the price is the focal point.

### Lists & Tables
The Admin UI uses a "Tiled" approach. Each data set is housed in a Level 2 elevated card. Tables use `label-md` for high information density while maintaining legibility through the Vazirmatn Medium weight.
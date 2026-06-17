---
name: Modern Mongolian Logistics
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#464555'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#712ae2'
  on-secondary: '#ffffff'
  secondary-container: '#8a4cfc'
  on-secondary-container: '#fffbff'
  tertiary: '#46494a'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e6061'
  on-tertiary-container: '#dadbdc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  sidebar-width: 280px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style
The design system is engineered for a Mongolian pre-order e-commerce administrative environment, prioritizing high-velocity data management and clarity. The brand personality is professional, efficient, and reliable. 

The aesthetic follows a **Corporate / Modern** style with a focus on functional minimalism. It utilizes a clean white foundation with structured panels to reduce cognitive load for operators managing complex cross-border logistics. The interface evokes a sense of order and precision, ensuring that critical status updates and order tracking are the primary focus.

## Colors
The palette is anchored by a high-contrast Indigo primary for action-oriented elements and a Purple secondary for accents and secondary highlights. 

- **Backgrounds**: Use `#FFFFFF` for the main canvas and `#F9FAFB` for structural panels and sidebar backgrounds to create subtle depth.
- **Typography**: The core text uses Slate Gray (`#1F2937`) to ensure high legibility while avoiding the harshness of pure black.
- **Status Colors**: These are utilized for order states. Completed orders use Green, Pending uses Yellow, and In-Transit uses Blue. Each status should utilize a high-saturation text color paired with a low-saturation (10% opacity) background of the same hue for badges.

## Typography
This design system uses **Inter** for its exceptional legibility in data-heavy SaaS applications and its robust support for the Cyrillic characters used in the Mongolian language.

- **Headlines**: Use Semi-Bold (600) or Bold (700) weights to establish clear information hierarchy.
- **Body Text**: Standardized at 14px for density without sacrificing readability.
- **Data Labels**: Use Uppercase with slight letter spacing for table headers and form labels to differentiate them from dynamic user data.
- **Language Support**: Ensure specific attention to line height to accommodate Mongolian Cyrillic descenders and ascenders.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. The sidebar remains at a fixed width of 280px while the main content area expands to a maximum of 1440px to prevent excessive line lengths on ultra-wide monitors.

- **Grid**: A 12-column grid is used for the main dashboard area.
- **Breakpoints**: 
  - Mobile (<768px): Sidebar collapses into a hamburger menu; margins reduce to 16px.
  - Tablet (768px - 1024px): 2-column card layouts.
  - Desktop (>1024px): Full 12-column availability with 24px gutters.
- **Rhythm**: Spacing follows an 8px base unit (8, 16, 24, 32, 48, 64) for consistent vertical and horizontal rhythm.

## Elevation & Depth
This design system utilizes **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to maintain a professional, flat aesthetic suitable for enterprise software.

- **Base Level**: `#F9FAFB` (Application background).
- **Surface Level**: `#FFFFFF` (Cards, Tables, Sidebar) with a 1px border of `#E5E7EB`.
- **Active State**: Subtle 4px blur shadow with 5% opacity for hovered interactive elements to provide tactile feedback.
- **Modals**: High elevation using a 15% opacity neutral shadow to pull the element forward from the data grid.

## Shapes
The shape language is defined by a consistent 12px (0.75rem) radius for primary containers, creating a modern and approachable feel while remaining structured.

- **Primary Cards**: 12px (`rounded-lg` equivalent in this system).
- **Buttons & Inputs**: 8px (`rounded` equivalent) for a slightly sharper, more functional appearance.
- **Badges**: 6px for a compact, professional look.
- **Icons**: Use a 1.5px or 2px stroke width with slightly rounded terminals to match the UI shape language.

## Components
- **Sidebar**: Dark-themed or light-gray panel with active states indicated by a 3px primary-blue left border and a light indigo background tint.
- **Data Tables**: Use subtle `#E5E7EB` horizontal borders only. No vertical lines. The header row should be `#F9FAFB` with `label-sm` typography.
- **Status Badges**: 
  - *Биелсэн* (Completed): Green text on Green-50 background.
  - *Хүлээгдэж буй* (Pending): Yellow text on Yellow-50 background.
  - *Тээвэрлэлтэнд* (In-Transit): Blue text on Blue-50 background.
- **Buttons**:
  - *Primary*: Solid `#4F46E5` with white text.
  - *Secondary*: White background with `#E5E7EB` border and `#1F2937` text.
- **Inputs**: 1px `#D1D5DB` border, changing to `#4F46E5` on focus with a 2px soft outer glow.
- **Top Search Bar**: Full-width within the content area, featuring a magnifying glass icon and a keyboard shortcut hint (e.g., ⌘K).
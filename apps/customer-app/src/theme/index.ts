import { brand } from '@bambam/shared';

// ── Font family constants ────────────────────────────────────────────────────
// These must match the keys passed to useFonts() in App.tsx.
// We intentionally stop at SemiBold (600) — nothing heavier.
export const fonts = {
  light: 'BricolageGrotesque_300Light',
  regular: 'BricolageGrotesque_400Regular',
  medium: 'BricolageGrotesque_500Medium',
  semiBold: 'BricolageGrotesque_600SemiBold'
} as const;

// ── Type scale ───────────────────────────────────────────────────────────────
// Aesthetic, minimal hierarchy. All sizes use the same family; weight and
// size do the heavy lifting rather than relying on Bold/ExtraBold.
export const type = {
  // Display — hero headings, onboarding, section openers
  display: { fontFamily: fonts.semiBold, fontSize: 30, lineHeight: 36, letterSpacing: -0.5 },
  // Heading — screen titles, card headers
  heading: { fontFamily: fonts.semiBold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  // Title — section headers, product names
  title: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 24, letterSpacing: -0.1 },
  // Body — general readable text
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  // Caption — muted metadata, timestamps, subtitles
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  // Label — buttons, chips, badges
  label: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 20, letterSpacing: 0.1 },
  // Price — monetary amounts
  price: { fontFamily: fonts.semiBold, fontSize: 17, lineHeight: 22 },
  // Input — text fields
  input: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 }
} as const;

export const customerTheme = {
  colors: {
    ...brand.colors,
    cardShadow: 'rgba(28, 37, 29, 0.07)',
    overlay: 'rgba(12, 17, 12, 0.5)'
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 28
  },
  radius: {
    sm: 12,
    md: 18,
    lg: 24,
    pill: 999
  },
  fonts,
  type
} as const;

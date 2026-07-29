import { createTheme } from '@mui/material';

// ─── "Luminous Performance" Design System ────────────────────────
// Source: DESIGN.MD.txt — Dark glassmorphism theme for luxury
// automotive inventory management.

// ─── Palette tokens from DESIGN.md ──────────────────────────────
const palette = {
  // Backgrounds & surfaces
  background:      '#0b1326',   // surface / surface-dim
  surfaceBright:   '#31394d',   // surface-bright
  containerLow:    '#131b2e',   // surface-container-low
  container:       '#171f33',   // surface-container
  containerHigh:   '#222a3d',   // surface-container-high
  containerHighest:'#2d3449',   // surface-container-highest

  // Text
  onSurface:       '#dae2fd',   // on-surface
  onSurfaceVar:    '#bac9cc',   // on-surface-variant
  outline:         '#849396',   // outline
  outlineVariant:  '#3b494c',   // outline-variant

  // Primary — Electric Blue
  primary:         '#00e5ff',   // primary-container (the vibrant one)
  primaryLight:    '#c3f5ff',   // primary
  primaryDark:     '#006875',   // inverse-primary

  // Secondary — Vibrant Purple
  secondary:       '#bb86fc',   // mapped from secondary-container vicinity
  secondaryLight:  '#dab9ff',   // secondary
  secondaryDark:   '#602b9d',   // secondary-container

  // Tertiary — Warm Amber
  tertiary:        '#ffc76e',   // tertiary-container
  tertiaryLight:   '#ffe9ce',   // tertiary

  // Error
  error:           '#ffb4ab',   // error
  errorContainer:  '#93000a',   // error-container

  // Status indicators (from Colors section)
  statusAvailable: '#00e5ff',   // Electric Blue
  statusPending:   '#bb86fc',   // Vibrant Purple
  statusSold:      '#64748b',   // Muted Slate Grey
};

// ─── Glassmorphism helpers ──────────────────────────────────────
const glass = {
  background: 'rgba(255, 255, 255, 0.04)',
  border:     '1px solid rgba(255, 255, 255, 0.10)',
  blur:       'blur(12px)',
  shadow:     '0 8px 40px rgba(0, 0, 0, 0.30)',
};

// ─── Theme ──────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main:  palette.primary,
      light: palette.primaryLight,
      dark:  palette.primaryDark,
      contrastText: '#00363d',  // on-primary
    },
    secondary: {
      main:  palette.secondary,
      light: palette.secondaryLight,
      dark:  palette.secondaryDark,
      contrastText: '#460283',  // on-secondary
    },
    background: {
      default: palette.background,
      paper:   palette.container,
    },
    error: {
      main: palette.error,
      dark: palette.errorContainer,
    },
    warning: {
      main: '#ffb100',
    },
    success: {
      main: palette.statusAvailable,
    },
    info: {
      main: palette.secondary,
    },
    text: {
      primary:   palette.onSurface,
      secondary: palette.onSurfaceVar,
    },
    divider: palette.outlineVariant,
  },

  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

    // display-lg → h2
    h2: {
      fontSize: '48px',
      fontWeight: 700,
      lineHeight: '56px',
      letterSpacing: '-0.02em',
    },
    // headline-lg → h3
    h3: {
      fontSize: '32px',
      fontWeight: 600,
      lineHeight: '40px',
      letterSpacing: '-0.01em',
    },
    // headline-md → h4
    h4: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: '32px',
    },
    // h5 keeps headline-md sizing
    h5: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: '32px',
    },
    // h6 — card titles
    h6: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: '28px',
    },
    // body-lg
    body1: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
    },
    // body-sm
    body2: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
    },
    // label-md → caption
    caption: {
      fontSize: '12px',
      fontWeight: 600,
      lineHeight: '16px',
      letterSpacing: '0.05em',
    },
    // Buttons
    button: {
      fontWeight: 600,
      textTransform: 'none' as const,
    },
  },

  shape: {
    borderRadius: 8, // 0.5rem — Cards & primary UI panels (lg in design)
  },

  spacing: 8, // 8px baseline grid

  components: {
    // ─── CssBaseline ──────────────────────────────────────────
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'none',
        },
      },
    },

    // ─── Cards — Glassmorphism ────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: glass.background,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          border: glass.border,
          padding: '24px', // card-padding from spacing
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        },
      },
    },

    // ─── AppBar — Glass header ────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(11, 19, 38, 0.80)',
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          borderBottom: glass.border,
        },
      },
    },

    // ─── Dialog — Modal elevation ─────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: palette.containerHigh,
          border: glass.border,
          boxShadow: glass.shadow,
        },
      },
    },

    // ─── Buttons ──────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none' as const,
        },
        containedPrimary: {
          background: palette.primary,
          color: '#00363d',
          boxShadow: 'none',
          '&:hover': {
            background: palette.primaryLight,
            boxShadow: `0 0 16px rgba(0, 229, 255, 0.25)`,
          },
        },
        outlinedSecondary: {
          borderColor: palette.secondary,
          color: palette.secondary,
          '&:hover': {
            borderColor: palette.secondaryLight,
            backgroundColor: 'rgba(187, 134, 252, 0.08)',
          },
        },
      },
    },

    // ─── Fab — Floating Action Button ─────────────────────────
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: `0 4px 20px rgba(0, 229, 255, 0.30)`,
        },
      },
    },

    // ─── TextFields — Input fields ────────────────────────────
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: palette.outlineVariant,
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            },
            '&:hover fieldset': {
              borderColor: palette.outline,
            },
            '&.Mui-focused fieldset': {
              borderColor: palette.primary,
              boxShadow: `0 0 0 2px rgba(0, 229, 255, 0.20)`,
            },
          },
        },
      },
    },

    // ─── Chip — Status badges ─────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.05em',
        },
      },
    },

    // ─── Tooltip ──────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: palette.containerHighest,
          border: glass.border,
          fontSize: '12px',
        },
      },
    },
  },
});

export default theme;

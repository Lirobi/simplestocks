import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          dark: colors.neutral[900],
          light: colors.neutral[100]
        },
        foreground: {
          dark: colors.neutral[200],
          light: colors.neutral[900]
        },
        primary: colors.red[400],
        secondary: {
          dark: colors.neutral[300],
          light: colors.neutral[700]
        },
        backgroundSecondary: {
          dark: colors.neutral[700],
          light: colors.neutral[300]
        },
        backgroundTertiary: {
          dark: colors.neutral[600],
          light: colors.neutral[400]
        },
        line: {
          dark: colors.neutral[500],
          light: colors.neutral[800]
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

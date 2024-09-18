/** @type {import('tailwindcss').Config} */

module.exports = {
  experimental: {
    optimizeUniversalDefaults: true,
  },
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    fontFamily: {
      sans: ["Satoshi", "sans-serif", "system-ui"],
    },
    extend: {
      screens: {
        "xs": "390px",
        "2xl": "1400px",
      },
      typography: {
      DEFAULT: {
        css: {
          p: {
            "margin-top": "0.25em",
            "margin-bottom": "0.25em",
            "line-height": "1.5",
          },
        }
      }
    },
      colors: {
        "brand-primary": "#076448",
        "brand-secondary": "#086268",
        "neutrals-1": "#ffffff",
        "neutrals-2": "#FAFAFA",
        "neutrals-3": "#f6f6f6",
        "neutrals-4": "#f2f1f2",
        "neutrals-5": "#dddddd",
        "neutrals-6": "#c7c7c7",
        "neutrals-7": "#9a999a",
        "neutrals-8": "#6d6c6d",
        "neutrals-9": "#5b5a5b",
        "neutrals-10": "#413f40",
        "neutrals-11": "#3a3839",
        "neutrals-12": "#312f30",
        "neutrals-13": "#1f1d1e",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        shake : {
          '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)'
          },
          '20%, 80%' : {
            transform: 'translate3d(2px, 0, 0)'
          },
          '30%, 50%, 70%': {
            transform: 'translate3d(-4px, 0, 0)'
          },
          '40%, 60%': {
            transform: 'translate3d(4px, 0, 0)'
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-out": "fadeOut 0.5s ease-in-out",
        "shake": 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require("tailwindcss-animate"), require("tailwindcss-animation-delay")],
};

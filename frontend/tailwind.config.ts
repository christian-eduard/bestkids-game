import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // standard shadcn variables mapping
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    dark: "var(--color-primary-dark, #c91dc9)",
                    light: "var(--color-primary-light, #fceafc)",
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

                // Project legacy colors
                "background-light": "var(--color-background-light, #f8f5f8)",
                "background-dark": "var(--color-background-dark, #221022)",
                "text-muted": "var(--color-text-muted, #9c499c)",
                "text-main": "#1c0d1c",
                "primary-hover": "var(--color-primary-dark, #c91dc9)",
                "surface-light": "#ffffff",
                "surface-dark": "var(--color-card-dark, #2d1b2d)",
            },
            fontFamily: {
                "display": ["Spline Sans", "sans-serif"],
                "body": ["Spline Sans", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "var(--radius)",
                "lg": "var(--radius)",
                "xl": "calc(var(--radius) + 4px)",
                "2xl": "calc(var(--radius) + 8px)",
                "full": "9999px"
            },
            boxShadow: {
                'soft': '0 10px 40px -10px rgba(244, 37, 244, 0.15)',
                'glow': '0 0 20px rgba(244, 37, 244, 0.3)',
            }
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/container-queries"),
        require("tailwindcss-animate"),
    ],
};
export default config;

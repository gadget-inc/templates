import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./web/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
	safelist: [
		"absolute",
		"sticky",
		"top-0",
		"top-full",
		"left-0",
		"left-6",
		"inset-0",
		"z-0",
		"z-10",
		"z-20",
		"z-30",
		"z-50",
		"z-100",
		"flex",
		"flex-row",
		"items-center",
		"justify-center",
		"gap-2",
		"ml-auto",
		"p-1",
		"mb-2",
		"ml-2",
		"w-full",
		"w-4",
		"h-4",
		"h-24",
		"max-w-[200px]",
		"bg-background",
		"bg-muted",
		"bg-muted/50",
		"border",
		"border-collapse",
		"shadow-md",
		"rounded-md",
		"text-center",
		"text-ellipsis",
		"whitespace-nowrap",
		"overflow-hidden",
		"cursor-pointer",
		"animate-spin",
		"hover:bg-muted"
	]
} satisfies Config;

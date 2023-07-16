/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
    darkMode: ['class'],
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            screens: {
                xs: '450px',
            },
            fontSize: {
                xsm: ['0.825rem', '1rem'],
                xlg: ['1.2rem', '1.75rem'],
            },
            zIndex: {
                dialog: '1000',
                snackbar: '1001',
            },
            colors: {
                overlay: 'rgb(0 0 0 / 0.3)',
                skeleton: '#d1d5db',
                primary: {
                    main: '#0ea5e9',
                    dark: '#1e40af',
                },
                secondary: {
                    lighter: '#d1d5db',
                    light: '#6b7280',
                    dark: '#1f2937',
                },
            },
            fontFamily: {
                roboto: ['var(--font-roboto)', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [],
}

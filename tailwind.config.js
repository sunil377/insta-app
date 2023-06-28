/** @type {import('tailwindcss').Config} */
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
            },
            zIndex: {
                dialog: '1000',
            },
            colors: {
                overlay: 'rgb(55 65 81 / 0.5)',
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
        },
    },
    plugins: [],
}

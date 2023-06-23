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
            colors:{
                overlay:"rgb(55 65 81 / 0.5)"
            }
        },
    },
    plugins: [],
}

import { ThemeProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'

export default function ThemeProvier({
    children,
    ...props
}: ThemeProviderProps) {
    return <ThemeProvider {...props}>{children}</ThemeProvider>
}

import { useTheme } from '@/context/ThemeContext'
import { ReactNode } from 'react'
import LaptopLayout from './LaptopLayout'
import MobileLayout from './MobileLayout'

function MainLayout({ children }: { children: ReactNode }) {
    const { is_mobile } = useTheme()

    return is_mobile ? (
        <MobileLayout>{children}</MobileLayout>
    ) : (
        <LaptopLayout>{children}</LaptopLayout>
    )
}

export default MainLayout

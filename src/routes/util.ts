import { initial_state_of_theme } from '@/context/ThemeContext'

export function getThemeFormCookies(
    cookies: Record<string, string>,
): initial_state_of_theme {
    const is_mobile = cookies.is_mobile === 'true'
    const is_dark = cookies.is_dark === 'true'

    return {
        is_mobile,
        is_dark,
    }
}

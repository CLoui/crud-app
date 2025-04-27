import { createContext, useState } from 'react'
import { Appearance } from 'react-native'
import { Colours } from '../constants/Colours'

export const ThemeContext = createContext({})

export const ThemeProvider = ({ children }) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme())

    const theme = colorScheme === 'dark' ? Colours.dark : Colours.light

    return (
        <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
            {children}
        </ThemeContext.Provider>
    )
}


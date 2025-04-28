import { createContext, useState } from 'react'
import { Appearance } from 'react-native'
import { Colours } from '../constants/Colours'

export const ThemeContext = createContext({})

// Theme provider to give details on colourscheme and theme to use based on Colours.ts
export const ThemeProvider = ({ children }) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme())

    const theme = colorScheme === 'dark' ? Colours.dark : Colours.light

    // Return the values of the current colorscheme
    return (
        <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
            {children}
        </ThemeContext.Provider>
    )
}


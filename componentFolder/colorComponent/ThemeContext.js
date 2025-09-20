import React, {createContext, useState} from 'react';

export const ThemeContext = createContext();   //pass context to the pages

/***************************************************************/
////*******************THEME PROVIDER*************************///
/***************************************************************/
function ThemeProvider({children}){
    const [isDarkMode, setIsDarkMode] = useState(false); //usestate for switching colors set to flase
    const toggleTheme = () => setIsDarkMode(previous => !previous); //if activate the fucntion it switch previous colors back and forth
    const theme ={
        isDarkMode, //dark mode
        toggleTheme, //toggle theme function
        colors:{
            gradient1: isDarkMode 
            ?  ['#353935', '#000000', '#353935']  //Dark
            :  ['#63dce3', '#ffffff', '#63dce3'], //Light

            gradient2: isDarkMode 
            ?  ['#353935', '#000000', '#353935']  //Dark
            :  ['#63dce3', '#b4f0f3', '#fce1e4'], //Light
        
            text: isDarkMode ? '#ffffff' : '#000000', //black, white
        }
    };

    return(
        <ThemeContext.Provider value={theme}>
            {/**Provide Children for color */}
            {children} 
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;
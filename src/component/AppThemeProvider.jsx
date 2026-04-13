import React from 'react'
import { useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import App from '../App';

const AppThemeProvider = () => {
      const theme = useSelector((state) => state.theme.theme);

  return (
   <ThemeProvider theme={theme}>
        <App/>
   </ThemeProvider>
  )
}

export default AppThemeProvider

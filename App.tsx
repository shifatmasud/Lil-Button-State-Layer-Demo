import React, { useState, CSSProperties } from 'react';
import { createTheme } from './theme.tsx';
import { Button } from './components/Core/Button.tsx';

// A simple theme switcher component
const ThemeSwitcher: React.FC<{ theme: any, toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
    const switcherStyle: CSSProperties = {
        position: 'absolute',
        top: theme.space.m,
        right: theme.space.m,
        padding: theme.space['4xs'],
        backgroundColor: theme.colors['Color/Base/Surface/2'],
        borderRadius: '9999px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${theme.colors['Color/Base/Surface/3']}`,
        boxSizing: 'border-box',
    };
    
    const toggleContainerStyle: CSSProperties = {
      width: '44px',
      height: '22px',
      display: 'flex',
      alignItems: 'center',
    };
    
    const toggleStyle: CSSProperties = {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        backgroundColor: theme.colors['Color/Base/Content/1'],
        transition: `transform ${theme.time.medium}`,
        transform: theme.mode === 'dark' ? 'translateX(22px)' : 'translateX(2px)',
    };
    
    return (
        <div style={switcherStyle} onClick={toggleTheme} role="switch" aria-checked={theme.mode === 'dark'} title="Toggle theme">
            <div style={toggleContainerStyle}>
                <div style={toggleStyle}></div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
    const toggleTheme = () => {
        setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    };
    const theme = createTheme(themeMode);
    // Attach mode to theme object for components to use
    (theme as any).mode = themeMode;

    const appStyle: CSSProperties = {
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors['Color/Base/Surface/1'],
        color: theme.colors['Color/Base/Content/1'],
        fontFamily: theme.typography.body.l.fontFamily,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: theme.space.m,
        boxSizing: 'border-box',
        transition: `background-color ${theme.time.medium}, color ${theme.time.medium}`,
        userSelect: 'none',
    };
    
    const titleStyle: CSSProperties = {
        ...theme.typography.headline.m,
        color: theme.colors['Color/Base/Content/2'],
        marginBottom: theme.space.m,
        pointerEvents: 'none',
    };

    return (
        <div style={appStyle}>
            <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
            <h1 style={titleStyle}>Soft Emotional Button</h1>
            <Button theme={theme} onClick={() => console.log('Button clicked!')}>
                Engage
            </Button>
        </div>
    );
};

export default App;

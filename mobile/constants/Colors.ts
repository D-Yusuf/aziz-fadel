/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * Fitness App Color Scheme
 * Primary colors: #1e1e1e (dark), #0496ff (blue), #f7f9f9 (light)
 */

const primaryBlue = '#0496ff';
const darkBackground = '#1e1e1e';
const lightBackground = '#f7f9f9';

export const Colors = {
  light: {
    text: '#1e1e1e',
    background: lightBackground,
    tint: primaryBlue,
    icon: '#1e1e1e',
    tabIconDefault: '#1e1e1e',
    tabIconSelected: primaryBlue,
    card: '#ffffff',
    border: '#e0e0e0',
  },
  dark: {
    text: '#f7f9f9',
    background: darkBackground,
    tint: primaryBlue,
    icon: '#f7f9f9',
    tabIconDefault: '#f7f9f9',
    tabIconSelected: primaryBlue,
    card: '#2a2a2a',
    border: '#404040',
  },
};

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RouterContext, useRouter } from "expo-router"
import Index from '../app/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

const mockTheme = {
  light: {
    text: '#11181C',
    subtext: '#253036',
    background: '#fff',
    secondary: 'rgba(41, 44, 51, 0.1)',
    icon: '#687076',
    button: 'royalblue',
    star: 'lightskyblue',
    colours: {
        red: 'darkred',
        green: 'darkgreen',
        blue: 'darkblue',
        purple: 'rebeccapurple',
    }
  },
  dark: {
    text: '#ECEDEE',
    subtext: '#babec2',
    background: '#292c33',
    secondary: 'rgba(255, 255, 255, 0.1)',
    icon: '#9BA1A6',
    button: 'royalblue',
    star: '#1F314F',
    colours: {
        red: 'lightcoral',
        green: 'lightgreen',
        blue: 'lightskyblue',
        purple: 'plum',
    }
  },
}

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(JSON.stringify([]))),
  removeItem: jest.fn(),
}));

jest.mock('expo-router', () => ({
  RouterContext: {
    Provider: ({ children, value }) => <>{children}</>,
  },
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('Navigation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Index Page and finds "My Lists" title', () => {
    const { getByTestId, getByText, debug } = render(
      <RouterContext.Provider value={mockRouter}>
        <ThemeContext.Provider value={{ theme: mockTheme.light, colorScheme: 'light' }}>
          <Index />
        </ThemeContext.Provider>
      </RouterContext.Provider>
    )
    debug();
    expect(getByText('My Lists')).toBeTruthy()
    // const addButton = getByTestId('add-circle');
    // fireEvent.press(addButton);

    // expect(mockRouter.push).toHaveBeenCalledWith('/todos/add');
  });

  // it('navigates back to the previous page', () => {
  //   const { getByTestId } = render(
  //     // <RouterContext.Provider value={mockRouter}>
  //       <TodosScreen />
  //     // </RouterContext.Provider>
  //   );

  //   const backButton = getByTestId('back-button');
  //   fireEvent.press(backButton);

  //   expect(mockRouter.back).toHaveBeenCalled();
  // });
});
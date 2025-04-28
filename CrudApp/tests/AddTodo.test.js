import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import AddScreen from '../app/todos/add'
import AsyncStorage from '@react-native-async-storage/async-storage'

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}))

describe('Add Task Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('adds a new task to AsyncStorage', async () => {
    const { getByPlaceholderText, getByText } = render(<AddScreen />)

    const input = getByPlaceholderText("Add a new todo")
    const addButton = getByText('Add')

    act(() => {
      fireEvent.changeText(input, 'New Task')
      fireEvent.press(addButton)
    })
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'TodoLists',
      expect.stringContaining('New Task')
    )
  })

  
})
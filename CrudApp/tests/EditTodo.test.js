import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import EditScreen from '../app/todos/edit'
import AsyncStorage from '@react-native-async-storage/async-storage'

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}))

describe('Edit Task Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('edits an existing task in AsyncStorage', async () => {
    const mockTask = { id: 1, title: 'Old Task', completed: false, starred: false, listId: 1 }

    const { getByPlaceholderText, getByText } = render(<EditScreen task={mockTask} />)

    const input = getByPlaceholderText('Old Task')
    const saveButton = getByText('Save')

    fireEvent.changeText(input, 'Updated Task')
    fireEvent.press(saveButton)

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'TodoLists',
      expect.stringContaining('Updated Task')
    )
  })
})
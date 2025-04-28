import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import TodosScreen from '../app/list/[id]'
import AsyncStorage from '@react-native-async-storage/async-storage'

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}))

describe('Remove Task Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('removes a task from AsyncStorage', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', completed: false, starred: false },
      { id: 2, title: 'Task 2', completed: false, starred: false },
    ]

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockTasks))

    const { getByText } = render(<TodosScreen />)

    const deleteButton = getByText('Delete Task 1')
    fireEvent.press(deleteButton)

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'TodoLists',
      expect.not.stringContaining('Task 1')
    )
  })
})
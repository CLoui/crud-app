// import * as SQLite from 'expo-sqlite'
import { openDB } from 'idb'
import { Platform } from 'react-native'

let db

// Initialize SQLite for mobile
if (Platform.OS !== 'web') {
  const SQLite = require('expo-sqlite'); // Dynamically import expo-sqlite
  db = SQLite.openDatabase('todos.db')

  db.transaction((tx) => {
    // Create the lists table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        colourId TEXT,
        darkColour TEXT,
        lightColour TEXT,
        lastEdited TEXT
      );`
    );

    // Create the todos table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        starred INTEGER DEFAULT 0,
        listId INTEGER NOT NULL,
        FOREIGN KEY (listId) REFERENCES lists (id) ON DELETE CASCADE
      );`
    );
  });
}

// Initialize IndexedDB for web
const initWebDB = async () => {
  return openDB('todos-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('lists')) {
        db.createObjectStore('lists', { keyPath: 'id', autoIncrement: true })
      }
      if (!db.objectStoreNames.contains('todos')) {
        db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
      }
    },
  })
}

// Add a list
export const addList = async (list) => {
  if (Platform.OS === 'web') {
    const webDB = await initWebDB()
    await webDB.add('lists', list)
  } else {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO lists (id, title, darkColour, lightColour, lastEdited) VALUES (?, ?, ?, ?, ?);',
        [list.id, list.title, list.darkColour, list.lightColour, list.lastEdited]
      )
    })
  }
}

export const addTodo = async (todo) => {
  if (Platform.OS === 'web') {
    const webDB = await initWebDB();
    await webDB.add('todos', todo);
  } else {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO todos (title, completed, starred, listId) VALUES (?, ?, ?, ?);',
        [todo.title, todo.completed ? 1 : 0, todo.starred ? 1 : 0, todo.listId]
      );
    });
  }
};

export const updateTodo = async (todo) => {
  if (Platform.OS === 'web') {
    const webDB = await initWebDB();
    await webDB.put('todos', todo); // Update the task in IndexedDB
  } else {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE todos SET title = ?, completed = ?, starred = ? WHERE id = ?;',
        [todo.title, todo.completed ? 1 : 0, todo.starred ? 1 : 0, todo.id]
      );
    });
  }
};

export const deleteTodo = async (id) => {
  if (Platform.OS === 'web') {
    const webDB = await initWebDB();
    await webDB.delete('todos', id); // Delete the task from IndexedDB
  } else {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM todos WHERE id = ?;', [id]); // Delete the task from SQLite
    });
  }
};

// Fetch all lists
export const getLists = async (callback) => {
  if (Platform.OS === 'web') {
    const webDB = await initWebDB()
    const lists = await webDB.getAll('lists')
    callback(lists)
  } else {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM lists;', [], (_, { rows }) => {
        callback(rows._array)
      })
    })
  }
}

// Fetch lists with todos
export const getListsWithTodos = async (callback) => {
  if (Platform.OS === 'web') {
    const webDB = await initWebDB();
    const lists = await webDB.getAll('lists');
    const todos = await webDB.getAll('todos');
    const listsWithTodos = lists.map((list) => ({
      ...list,
      todos: todos.filter((todo) => todo.listId === list.id),
    }));
    callback(listsWithTodos);
  } else {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT lists.*, todos.id AS todoId, todos.title AS todoTitle, todos.completed, todos.starred
         FROM lists
         LEFT JOIN todos ON lists.id = todos.listId;`,
        [],
        (_, { rows }) => {
          const groupedLists = rows._array.reduce((acc, row) => {
            let list = acc.find((l) => l.id === row.id);
            if (!list) {
              list = {
                id: row.id,
                title: row.title,
                colourId: row.colourId,
                darkColour: row.darkColour,
                lightColour: row.lightColour,
                lastEdited: row.lastEdited,
                todos: [], // Initialize todos as an empty array
              };
              acc.push(list);
            }
            if (row.todoId) {
              list.todos.push({
                id: row.todoId,
                title: row.todoTitle,
                completed: row.completed,
                starred: row.starred,
              });
            }
            return acc;
          }, []);
          callback(groupedLists);
        }
      );
    });
  }
};

export const getTodosByListId = async (listId, callback) => {
  if (Platform.OS === 'web') {
    const webDB = await initWebDB();
    const todos = await webDB.getAll('todos');
    const filteredTodos = todos.filter((todo) => todo.listId === listId); // Filter todos by listId
    callback(filteredTodos);
  } else {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM todos WHERE listId = ?;',
        [listId],
        (_, { rows }) => {
          callback(rows._array); // Return the todos as an array
        }
      );
    });
  }
};

// Update a list
export const updateList = async (list) => {
  if (Platform.OS === 'web') {
    const webDB = await initWebDB()
    await webDB.put('lists', list)
  } else {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE lists SET title = ?, darkColour = ?, lightColour = ?, lastEdited = ? WHERE id = ?;',
        [list.title, list.darkColour, list.lightColour, list.lastEdited, list.id]
      );
    });
  }
};

// Delete a list
export const deleteList = async (id) => {
  if (Platform.OS === 'web') {
    const webDB = await initWebDB()
    await webDB.delete('lists', id)
  } else {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM lists WHERE id = ?;', [id])
    })
  }
}
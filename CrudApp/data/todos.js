import AsyncStorage from "@react-native-async-storage/async-storage"

export const data = [
    {
        id: 1,
        title: "Personal",
        colourId: "1",
        darkcolour: "darkred",
        lightcolour: "lightcoral",
        lastEdited: "2025-01-04 10:34:23",
        todos: [
            { id: 1, title: "Finish book", completed: true, starred: false },
            { id: 2, title: "Buy groceries", completed: false, starred: false },
        ],
    },
    {
        id: 2,
        title: "Work",
        colourId: "1",
        darkcolour: "darkred",
        lightcolour: "lightcoral",
        lastEdited: "2025-01-04 10:34:23",
        todos: [
            { id: 1, title: "Prepare presentation", completed: false, starred: true },
            { id: 2, title: "Send emails", completed: false, starred: false },
        ],
    },
]

export const saveLists = async (lists) => {
  try {
    console.log("Saving jsonValue:", lists) // Debugging log
    const jsonValue = JSON.stringify(lists)
    await AsyncStorage.setItem("TodoLists", jsonValue)
  } catch (e) {
    console.error("Error saving lists:", e)
  }
}

export const fetchLists = async (callback) => {
    try {
        const jsonValue = await AsyncStorage.getItem("TodoLists")
        console.log("Fetched jsonValue:", jsonValue) // Debugging log
        const lists = jsonValue != null && jsonValue != 'undefined' ? JSON.parse(jsonValue) : [...data]
        console.log("Populated lists:", lists) // Debugging log
        
        if (lists && lists.length) {
            callback(lists.sort((a, b) => b.id - a.id))
        } else {
            callback([])
        }
    } catch (e) {
      console.error("Error fetching lists:", e)
      callback([])
    }
}

export const initializeLists = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem("TodoLists")
        if (jsonValue === null || jsonValue === 'undefined') {
            await AsyncStorage.setItem("TodoLists", JSON.stringify(data))
            console.log("Initialized TodoLists with default data.")
        }
    } catch (e) {
        console.error("Error initializing lists:", e)
    }
};

// export const data = [
//     {
//         "id": 1,
//         "title": "Finish book",
//         "completed": true,
//         "starred": false,
//     },
//     {
//         "id": 2,
//         "title": "Buy groceries",
//         "completed": false,
//         "starred": false,
//     },
//     {
//         "id": 3,
//         "title": "Wash clothes",
//         "completed": false,
//         "starred": false,
//     }
// ]
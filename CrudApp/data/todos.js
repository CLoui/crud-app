import AsyncStorage from "@react-native-async-storage/async-storage"

// Default data to load on initialization if app is empty
export const data = [
    {
        id: 1,
        title: "Personal",
        colourId: "1",
        darkcolour: "darkred",
        lightcolour: "lightcoral",
        lastEdited: "2025-01-04 10:34:23",
        todos: [
            {
                "id": 1,
                "title": "Finish book",
                "completed": true,
                "starred": false
            },
            {
                "id": 2,
                "title": "Buy groceries",
                "completed": false,
                "starred": false
            }
        ]
    },
    {
        id: 2,
        title: "Work",
        colourId: "1",
        darkcolour: "darkred",
        lightcolour: "lightcoral",
        lastEdited: "2025-01-04 10:34:23",
        todos: [
            {
                "id": 1,
                "title": "Create Presentation",
                "completed": false,
                "starred": false
            },
            {
                "id": 2,
                "title": "Send emails",
                "completed": false,
                "starred": false
            }
        ]
    },
];

// Save the todo lists
export const saveLists = async (lists) => {
  try {
    const jsonValue = JSON.stringify(lists);
    await AsyncStorage.setItem("TodoLists", jsonValue);
  } catch (e) {
    console.error("Error fetching lists:", e);
  };
};

// Fetch the todo lists from storage
export const fetchLists = async (callback) => {
    try {
        const jsonValue = await AsyncStorage.getItem("TodoLists");
        const lists = jsonValue != null && jsonValue != 'undefined' ? JSON.parse(jsonValue) : [...data];
        
        if (lists && lists.length) {
            callback(lists.sort((a, b) => b.id - a.id));
        } else {
            callback([]);
        };
    } catch (e) {
      console.error("Error fetching lists:", e);
      callback([]);
    };
};

// Initialist lists with values or default data
export const initializeLists = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem("TodoLists");
        if (jsonValue === null || jsonValue === 'undefined') {
            await AsyncStorage.setItem("TodoLists", JSON.stringify(data));
        }
    } catch (e) {
        console.error("Error initializing lists:", e);
    };
};
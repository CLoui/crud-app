
# To Do List App

A comprehensive ToDo List App to simplify and organize your routine. Create, edit, and remove lists of tasks with ease. 


![Screenshot](https://github.com/CLoui/crud-app/blob/master/CrudApp/crudAppScreenshot.png)


## Functions

- Allows users to organize their tasks into multiple lists
- Lists can be colour coded to improve organization
- Search for lists or tasks
- Cross tasks off without removing it by simply clicking on it
- Important tasks can be starred and pinned to the top of its list
- App can be viewed in light/ dark mode



## Tech Stack

**Framework:** React Native using mainly Expo Library

**Testing:** Manual, and Jest for React

**Server:** Node (npm, npx)


## Design Principles

The Design Principles used in this project include: 

- No Tunnel Vision: Throughout the process, there was no focus on targeting one requirement without consideration of all others
- Uniformity: The project was written and designed to appear as one collective application.
- Accommodates Change: Areas of the app are designed to allow an expanded set of future features
- Error Evaluation: This project has been thoroughly tested, and known errors have been identified and corrected to the best of abilities.
## Design Choices

This app though simple in idea, was chosen for this project as it allows flexibilty on adding a variety of features to it without worrying excessively on complex logic. The goal was to include all the required functionality of a CRUD app, but still be able to improve on the UI, and other helpful features.

**Frontend**

Considerations for user experience were taken into account. A simple sans serif font was chosen to ensure readability. Including a toggle to change from light mode to dark mode allows for better ease of use. The colours chosen for each theme also have high contrast with each other, to ensure that there was a distinct differentiation between the two for the user.

**Backend**

The backend is created from AsyncStorage system built into React Native apps. Other considerations were made including SQLite, and IndexedDB. Both SQLite and IndexedDB allow for a larger storage limit, and more complex dataset structure. However SQLite is not compatible with web apps, and IndexedDB is not compatible with mobile apps. Therefore the options were to use AsyncStorage, or a combination of SQLite and IndexedDB. To avoid overengineering, I chose to use AsyncStorage.
## Installation

Instal independecies:
```bash
  npm install
```
To run this project: 

```bash
  npm expo start
```

If cache needs to be cleared before running: 
```bash
  npm expo start -c
```

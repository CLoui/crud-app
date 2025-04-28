import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { Inter_500Medium } from "@expo-google-fonts/inter";
import { ThemeProvider } from "../context/ThemeContext";
import { initializeLists } from "../data/todos";


export default function RootLayout() {
  useEffect(() => {
    initializeLists();
    document.title = "To Do List App"; // Set the tab title dynamically
  }, []);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false, // Hide the header
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 24,
              fontFamily: Inter_500Medium
            },
            headerLeft: null,
            headerStyle: {
              backgroundColor: '#bdbdbd',
            },
            headerTitleAlign: 'center',
          }}
        >
          {/* Screens */}
          <Stack.Screen name="index" 
            options={{ title: '📝 To Do List' }} />
          <Stack.Screen name="addList" 
            options={{ title: 'Add New List' }} />
          <Stack.Screen name="todos/edit" 
            options={{ title: 'Edit Task' }} />
          <Stack.Screen name="todos/add"
            options={{ title: 'Add Task' }} />
          <Stack.Screen name="list/[id]" 
            options={{ title: '📝 To Do List' }} />
          <Stack.Screen name="list/edit" 
            options={{ title: 'Edit List' }} />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

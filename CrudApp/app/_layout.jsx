import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../context/ThemeContext";
import { Inter_500Medium } from "@expo-google-fonts/inter";
import { useEffect } from "react";
import { initializeLists } from "../data/todos";


export default function RootLayout() {
  useEffect(() => {
    // initializeDatabase(); // Initialize SQLite database
    initializeLists();
    document.title = "To Do List App"; // Set the tab title dynamically
  }, [])

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 24,
              fontFamily: Inter_500Medium
            },
            headerStyle: {
              backgroundColor: '#bdbdbd',
            },
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen name="index" 
            options={{ title: 'To Do List' }} />
          <Stack.Screen name="/todos/list/[id]"
            options={{ title: 'List' }} />
          <Stack.Screen name="todos/[id]" 
            options={{ title: 'Edit' }} />
          <Stack.Screen name="todos/add" 
            options={{ title: 'Add' }} />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

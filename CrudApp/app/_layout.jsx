import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, ThemeContext } from "../context/ThemeContext";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { useContext } from "react";
import { Pressable } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';


export default function RootLayout() {
  // const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
  
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
            // headerRight: () => (
            //   <Pressable
            //     onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
            //     style={{marginRight: 20, flexDirection: 'row'}}
            //   >
            //     <Octicons name="moon" size={36} color={colorScheme === 'dark' ? theme.text : 'gray'} selectable={undefined} style={{ width: 36 }} />
            //     <Octicons name="sun" size={36} color={colorScheme === 'light' ? theme.text : 'gray'} selectable={undefined} style={{ width: 36 }} />
            //   </Pressable>
            // ),
          }}
        >
          <Stack.Screen name="index" 
            options={{ title: 'To Do List' }} />
          <Stack.Screen name="todos/[id]" 
            options={{ title: 'Edit' }} />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

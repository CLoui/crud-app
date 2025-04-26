import { Text, View, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import Animated, { LinearTransition } from "react-native-reanimated";

import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { fetchLists, saveLists } from "@/data/todos";

import { ThemeContext } from "@/context/ThemeContext";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
MaterialIcons;
MaterialCommunityIcons;


export default function Index() {
  const [ lists, setLists ] = useState([])
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
  const [ loaded, error ] = useFonts({ Inter_500Medium })
  const router = useRouter()

  useEffect(() => {
    fetchLists(setLists)
  }, [setLists])

  // useEffect(() => {
  //   saveLists(setLists)
  // }, [setLists])

  if (!loaded && !error) {
    return null
  }

  const styles = createStyles(theme, colorScheme)

  const handleListPress = (id) => {
    router.push(`/list/${id}`)
  }

  const handleAddPress = () => {
    router.push('/addList')
  }

  const handleEditPress = (id) => {
    router.push({pathname: '/list/edit', params: { id: id }})
  }

  const removeList = (id) => {
    setLists(lists.filter(list => list.id !== id))
    saveLists(lists.filter(list => list.id !== id))
  }

  const renderList = ({ item }) => (
    <View style={styles.todoItem}>
        <Pressable key={item.id} onPress={() => handleListPress(item.id)}>
          <Text style={styles.todoText}>{item.title}</Text>
        </Pressable>
        <Pressable onPress={() => handleEditPress(item.id)}>
          <MaterialIcons name="mode-edit" size={36} color='royalblue' selectable={undefined} />
        </Pressable>
        <Pressable onPress={() => removeList(item.id)}>
          <MaterialCommunityIcons name="delete" size={36} color='royalblue' selectable={undefined}/>
        </Pressable>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>My Lists</Text>
        <Pressable onPress={() => handleAddPress()}>
          <Ionicons name="add-circle" size={44} color="royalblue" />
        </Pressable>
        <Pressable
          onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
          style={{marginLeft: 10, flexDirection: 'row', borderWidth: 2, borderRadius: 5, borderColor: 'gray'}}
        >
          <Octicons 
            name="moon" 
            size={30} 
            color={colorScheme === 'dark' ? theme.text : 'gray'} 
            selectable={undefined} 
            style={{ width: 36, padding: 5, paddingRight: 35, backgroundColor: 'rgba(41, 44, 51, 0.1)' }} />
          <Octicons 
            name="sun" 
            size={30} 
            color={colorScheme === 'light' ? 'gold' : 'gray'} 
            selectable={undefined} 
            style={{ width: 36, padding: 5, paddingRight: 35, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        </Pressable>
      </View>
      <Animated.FlatList
        data={lists}
        renderItem={renderList}
        keyExtractor={list => list.id}
        contentContainerStyle={{ flexGrow: 1 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
      />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: 10,
      padding: 10,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    input: {
      flex: 1,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      minWidth: 0,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === 'dark' ? 'black' : 'white',
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: 10,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    title: {
      flex: 1,
      fontSize: 28,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray',
    },
    starred: {
      backgroundColor: theme.star,
      borderRadius: 5,
    },
    starredList: {
      flexGrow: 0,
    },
    listItem: {
      padding: 15,
      marginVertical: 10,
      backgroundColor: "#f0f0f0",
      borderRadius: 5,
    },
    listTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
  })
}

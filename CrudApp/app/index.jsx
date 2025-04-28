import { Text, View, Pressable, StyleSheet, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState, useContext, useEffect } from "react"
import Animated, { LinearTransition } from "react-native-reanimated"

import { StatusBar } from "expo-status-bar"
import { useRouter } from "expo-router"
import { fetchLists, saveLists } from "@/data/todos"

import { ThemeContext } from "@/context/ThemeContext"
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter"
import Octicons from '@expo/vector-icons/Octicons'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'


export default function Index() {
  const [ lists, setLists ] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
  const [ loaded, error ] = useFonts({ Inter_500Medium })
  const router = useRouter()

  useEffect(() => {
    fetchLists(setLists)
  }, [setLists])

  if (!loaded && !error) {
    return null
  }

  const styles = createStyles(theme, colorScheme)

  // Filtered lists based on the search query
  const filteredLists = lists.filter((list) =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleListPress = (id) => {
    router.push(`/list/${id}`)
  }

  const handleAddPress = () => {
    router.push('/addList')
  }

  const handleEditPress = (id) => {
    router.push({pathname: '/list/edit', params: { id: id, prev: '/' }})
  }

  const removeList = (id) => {
    setLists(lists.filter(list => list.id !== id))
    saveLists(lists.filter(list => list.id !== id))
  }

  const renderList = ({ item }) => {
    const formattedDate = item.lastEdited ? new Date(item.lastEdited).toLocaleDateString() + '   ' : ''
    
    return (
      <View style={styles.listItem}>
          <Pressable key={item.id} onPress={() => handleListPress(item.id)}>
            <Text style={{
              fontSize: 20, 
              fontFamily: 'Inter_500Medium',
              color: colorScheme === 'light' ? item.darkcolour : item.lightcolour
            }}>{item.title}</Text>
            <Text style={styles.subText}>{formattedDate}{item.todos.length} Items</Text>
          </Pressable>
          <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
            <Pressable onPress={() => handleEditPress(item.id)}>
              <MaterialIcons 
                name="mode-edit" 
                size={36} 
                color='royalblue' 
                selectable={undefined} 
              />
            </Pressable>
            <Pressable onPress={() => removeList(item.id)}>
              <MaterialCommunityIcons 
                name="delete" 
                size={36} 
                color='royalblue' 
                selectable={undefined}
              />
            </Pressable>
          </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{margin: 12, flex: 1}}>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>📝 My Lists</Text>
          <Pressable onPress={() => handleAddPress()}>
            <Ionicons name="add-circle" size={44} color="royalblue" />
          </Pressable>
          <Pressable
            onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
            style={styles.themeToggle}
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
        <TextInput
          style={styles.searchBar}
          placeholder="Search lists..."
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Animated.FlatList
          data={filteredLists}
          renderItem={renderList}
          keyExtractor={list => list.id.toString()}
          contentContainerStyle={{ flexGrow: 1 }}
          itemLayoutAnimation={LinearTransition}
          keyboardDismissMode="on-drag"
        />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </View>
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
      // padding: 10,
      width: '100%',
      maxWidth: 1024,
      marginTop: 50,
      marginBottom: 20,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    themeToggle: {
      marginLeft: 10, 
      flexDirection: 'row', 
      borderWidth: 2, 
      borderRadius: 5, 
      borderColor: 'gray'
    },
    listItem: {
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
      fontSize: 36,
      fontWeight: 'bold',
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    todoText: {
      flex: 1,
      fontSize: 20,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    subText: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'Inter_500Medium',
      color: theme.subtext,
      marginTop: 5,
    },
    searchBar: {
      borderRadius: 10,
      marginHorizontal: 'auto',
      width: '100%',
      maxWidth: 1024,
      marginBottom: 10,
      padding: 10,
      margin: 10,
      fontSize: 16,
      color: theme.subtext,
      backgroundColor: theme.secondary,
    },
  })
}

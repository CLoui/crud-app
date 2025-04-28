import { useEffect, useState, useContext } from "react"
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native"
import { fetchLists, saveLists } from "../../data/todos"
import { useLocalSearchParams, useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { ThemeContext } from "@/context/ThemeContext"

import Octicons from '@expo/vector-icons/Octicons'
import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
MaterialIcons
MaterialCommunityIcons

import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter"
import Animated, { LinearTransition } from "react-native-reanimated"
import { StatusBar } from "expo-status-bar"

export default function TodosScreen() {
    const { id } = useLocalSearchParams() // Get the listId from the route
    const [tasks, setTasks] = useState([])
    const [lists, setLists] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
    const [loaded, error] = useFonts({ Inter_500Medium })
    const router = useRouter()
    
    useEffect(() => {
        fetchLists((lists) => {
            const list = lists.find((list) => list.id === parseInt(id))
            setLists(lists)
            setTasks(list)
        })
    }, [id])

    if (!loaded && !error) {
        return null
    }

    const styles = createStyles(theme, colorScheme)
    
    // Filtered tasks based on the search query
    const filteredTasks = tasks.todos.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const toggleTodo = (taskId) => {
        const newTasks = tasks.todos.map(todo => 
            todo.id === parseInt(taskId) ? { ...todo, completed: !todo.completed } : todo
        )
        const newList = {...tasks, todos: newTasks, lastEdited: new Date().toISOString()}
        setTasks(newList)
        const updatedLists = [newList, ...lists.filter(list => list.id !== parseInt(id))]
        saveLists(updatedLists)
    }
    
    const toggleStar = (taskId) => {
        const newTasks = tasks.todos.map(todo => 
            todo.id === parseInt(taskId) ? { ...todo, starred: !todo.starred } : todo
        )
        const newList = {...tasks, todos: newTasks, lastEdited: new Date().toISOString()}
        setTasks(newList)
        const updatedLists = [newList, ...lists.filter(list => list.id !== parseInt(id))]
        saveLists(updatedLists)
    }
        
    const removeTodo = (taskId) => {
        const newTasks = tasks.todos.filter(todo => todo.id !== taskId)
        const newList = {...tasks, todos: newTasks}
        setTasks(newList)
        const list = lists.find(list => list.id === parseInt(id))
        list.todos = (tasks.todos.filter(todo => todo.id !== taskId))
        const updatedLists = [list, ...lists.filter(list => list.id !== parseInt(id))]
        saveLists(updatedLists)
    }
    
    const editTitle = () => {
        router.push({pathname: '/list/edit', params: { id: id, prev: `/list/${id}` }})
    }

    const handleAddPress = () => {
        router.push({pathname: '/todos/add', params: { id: id }})
    }

    const handleEditPress = (taskId) => {
        router.push({pathname: '/todos/edit', params: { id: id, taskId: taskId }})
    }

    const handleReturn = () => {
        router.push('/')
    }
  
    const renderItem = ({ item }) => (
        <View style={[styles.todoItem, item.starred && styles.starred]}>
            <Text
                style={[styles.todoText, item.completed && styles.completedText]}
                onPress={() => toggleTodo(item.id)}
            >
                {item.title}
            </Text>
            <Pressable onPress={() => toggleStar(item.id)}>
                {item.starred
                ? <AntDesign name="star" size={36} color='royalblue'/>
                : <AntDesign name="staro" size={36} color='royalblue'/>
                }
            </Pressable>
            <Pressable onPress={() => handleEditPress(item.id)}>
                <MaterialIcons name="mode-edit" size={36} color='royalblue' selectable={undefined} />
            </Pressable>
            <Pressable onPress={() => removeTodo(item.id)}>
                <MaterialCommunityIcons name="delete" size={36} color='royalblue' selectable={undefined}/>
            </Pressable>
        </View>
    )

  return (
    <SafeAreaView style={styles.container}>
        <View style={{margin: 12, alignItems: 'center', flex: 1}}>
            <View style={styles.inputContainer}>
                <Pressable onPress={() => handleReturn()}>
                    <Ionicons name="arrow-back-circle" size={44} color="royalblue" />
                </Pressable>
                <View style={styles.addAndTheme}>
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
            </View>
            <View style={styles.navAndTitle}>
                <Text style={[
                    styles.title, 
                    {color: colorScheme === 'light' ? tasks.darkcolour : tasks.lightcolour}]}>
                    {tasks.title}
                </Text>
                <Pressable onPress={() => editTitle()} style={{marginTop: 15, marginLeft: 10}}>
                    <MaterialIcons name="mode-edit" size={30} color={theme.text} selectable={undefined} />
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
                style={styles.starredList}
                data={filteredTasks.filter(todo => todo.starred === true)}
                renderItem={renderItem}
                keyExtractor={todo => todo.id}
                contentContainerStyle={{ flexGrow: 1 }}
                itemLayoutAnimation={LinearTransition}
                keyboardDismissMode="on-drag" 
            />
            <Animated.FlatList
                style={styles.list}
                data={filteredTasks.filter(todo => todo.starred === false)}
                renderItem={renderItem}
                keyExtractor={todo => todo.id}
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
            marginBottom: 10,
            // padding: 10,
            width: '100%',
            maxWidth: 1024,
            marginTop: 50,
            marginHorizontal: 'auto',
            pointerEvents: 'auto',
            justifyContent: 'space-between'
        },
        navAndTitle: {
            flexDirection: 'row',
            width: '100%',
            maxWidth: 1024,
            // marginLeft: 10,
        },
        list: {
            width: '100%',
            maxWidth: 1024,
        },
        addAndTheme: {
            flexDirection: 'row',
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
            width: '100%',
            maxWidth: 1024,
            flexGrow: 0,
        },
        title: {
            flex: 1,
            fontSize: 36,
            fontWeight: 'bold',
            fontFamily: 'Inter_500Medium',
            color: theme.text,
            flexGrow: 0,
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 5,
        },
        searchBar: {
            borderRadius: 10,
            marginHorizontal: 'auto',
            width: '100%',
            maxWidth: 1024,
            marginBottom: 20,
            padding: 10,
            margin: 10,
            fontSize: 16,
            color: theme.subtext,
            backgroundColor: theme.secondary,
        },
    });
}
import { View, Text, StyleSheet, Pressable, TextInput, Modal } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"

import { ThemeContext } from "@/context/ThemeContext"
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter"
import { fetchLists, saveLists } from "../../data/todos"

export default function AddScreen() {
    const { id } = useLocalSearchParams() // Get the listId from the route
    const [text, setText] = useState('')
    const [todos, setTodos] = useState([])
    const [ lists, setLists ] = useState([])
    const { colorScheme, theme } = useContext(ThemeContext)
    const router = useRouter()
    const [loaded, error] = useFonts({ Inter_500Medium })
    const [isModalVisible, setModalVisible] = useState(true); 

    useEffect(() => {
        fetchLists((lists) => {
            const list = lists.find((list) => list.id === parseInt(id))
            setLists(lists)
            setTodos(list ? list.todos : [])
        })   
    }, [id])

    if (!loaded && !error) {
        return null
    }

    const styles = createStyles(theme, colorScheme)

    const cancelEdit = () => {
        setText('')
        setModalVisible(false);
        router.push(`/list/${id}`)
    }

    const addTodo = () => {
        const newTodo = { 
            id: Date.now(), 
            title: text, 
            completed: false, 
            starred: false }
        const updatedTodos = [newTodo, ...todos]

        setTodos(updatedTodos)
        const list = lists.find(list => list.id === parseInt(id))
        list.todos = (updatedTodos)
        list.lastEdited = new Date().toISOString() 
        console.log('Updated Todos: ', list)
        updatedLists = [list, ...lists.filter(list => list.id !== parseInt(id))]
        saveLists(updatedLists)
        
        setText('')
        setModalVisible(false)
        router.push(`/list/${id}`)
    }

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => cancelEdit()}
            >
                <View style={[styles.inputContainer, {flexDirection: 'column', justifyContent: "center", flex: 1,}]}>
                    <Text style={styles.title}>Add Task</Text>
                    <View>
                        <TextInput 
                            style={styles.input}
                            maxLength={30}
                            placeholder="Add a new todo"
                            placeholderTextColor="gray"
                            value={text}
                            onChangeText={setText}
                        />
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Pressable 
                            onPress={addTodo} 
                            style={styles.addButton}
                        >
                            <Text style={styles.buttonText}>Add</Text>
                        </Pressable>
                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => cancelEdit()}
                        >
                            <Text style={[styles.buttonText, { color: 'white' }]}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            </Modal>
        </SafeAreaView>   
    )
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: theme.background,
            justifyContent: 'center',
            alignItems: 'center',
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            gap: 6,
            width: '80%',
            maxWidth: 500,
            maxHeight: 200,
            marginHorizontal: 'auto',
            pointerEvents: 'auto',
            margin: 100,
            backgroundColor: theme.background,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
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
            margin: 10,
        },
        cancelButton: {
            backgroundColor: 'red',
            borderRadius: 5,
            padding: 10,
            margin: 10,
        },
        buttonText: {
            fontSize: 18,
            color: colorScheme === 'dark' ? 'black' : 'white',
        },
        title: {
            flex: 1,
            fontSize: 24,
            fontFamily: 'Inter_500Medium',
            color: theme.text,
            margin: 10,
            marginTop: 10,
        },
    })
}
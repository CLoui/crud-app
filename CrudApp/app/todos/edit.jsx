import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput, Modal } from 'react-native';

import { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { data, fetchLists, saveLists } from "../../data/todos";

export default function EditScreen() {
    const { id, taskId } = useLocalSearchParams()
    const [todo, setTodo] = useState({})
    const [todos, setTodos] = useState([])
    const [ lists, setLists ] = useState([])
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
    const router = useRouter()
    const [loaded, error] = useFonts({ Inter_500Medium })
    const [isModalVisible, setModalVisible] = useState(true); 

    useEffect(() => {
        fetchLists((lists) => {
            const list = lists.find((list) => list.id === parseInt(id))
            setLists(lists)
            setTodos(list)
            const task = list.todos.find((todo) => todo.id === parseInt(taskId))
            setTodo(task)
        })
    }, [id])

    if (!loaded && !error) {
        return null
    }

    const styles = createStyles(theme, colorScheme)

    const handleSave = async () => {
        const list = lists.find((list) => list.id === parseInt(id))
        const task = list.todos.find((todo) => todo.id === parseInt(taskId))
        const savedTodo = { ...task, title: todo.title }
        
        if (list.todos) {
            const otherTasks = list.todos.filter(task => task.id !== parseInt(savedTodo.id))
            const updatedTodos = [...otherTasks, savedTodo]
            setTodos(updatedTodos)
            list.todos = (updatedTodos)
            const updatedLists = [list, ...lists.filter(list => list.id !== parseInt(id))]
            saveLists(updatedLists)
        } else {
            const updatedTodos = [savedTodo]
            setTodos(updatedTodos)
            list.todos = (updatedTodos)
            const updatedLists = [list, ...lists.filter(list => list.id !== parseInt(id))]
            saveLists(updatedLists)
        }

        setModalVisible(false)
        router.push(`/list/${id}`)
    }

    const cancelEdit = () => {
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
                    <View>
                        <TextInput 
                            style={styles.input}
                            maxLength={30}
                            placeholder={todo?.title || 'Edit task'}
                            placeholderTextColor="gray"
                            value={todo?.title || ''}
                            onChangeText={(text) => setTodo(prev => ({ ...prev, title: text }))}
                        />
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Pressable
                            style={styles.saveButton}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.saveButton, { backgroundColor: 'red' }]}
                            onPress={() => cancelEdit()}
                        >
                            <Text style={[styles.saveButtonText, { color: 'white' }]}>Cancel</Text>
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
        saveButton: {
            backgroundColor: theme.button,
            borderRadius: 5,
            padding: 10,
            margin: 10,
        },
        saveButtonText: {
            fontSize: 18,
            color: colorScheme === 'dark' ? 'black' : 'white',
        },
    })
}
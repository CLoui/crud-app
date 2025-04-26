import { View, Text, StyleSheet, Pressable, TextInput, Modal } from 'react-native';
import { useState, useEffect, useContext } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { fetchLists, saveLists } from "@/data/todos";


export default function EditListScreen() {
    const { id } = useLocalSearchParams()
    const [ list, setList ] = useState([])
    const { colorScheme, theme } = useContext(ThemeContext)
    const router = useRouter()
    const [loaded, error] = useFonts({ Inter_500Medium })
    const [isModalVisible, setModalVisible] = useState(true); 

    useEffect(() => {
        fetchLists((lists) => {
            const myList = lists.find(list => list.id.toString() === id)
            setList(myList)
            console.log('Fetched list ', id)
        })
    }, [setList])
    
    if (!loaded && !error) {
        return null
    }

    const styles = createStyles(theme, colorScheme)

    const handleSave = async () => {
        try {
            const savedList = { ...list, title: list.title }

            const jsonValue = await AsyncStorage.getItem('TodoLists')
            const storageLists = jsonValue != null && jsonValue != 'undefined' ? JSON.parse(jsonValue) : null
            
            if (storageLists && storageLists.length) {
                const otherLists = storageLists.filter(list => list.id !== savedList.id)
                const allLists = [...otherLists, savedList]
                await AsyncStorage.setItem('TodoLists', JSON.stringify(allLists))
            } else {
                await AsyncStorage.setItem('TodoLists', JSON.stringify([savedList]))
            }

            setModalVisible(false); // Close the modal
            router.push('/')
        } catch (e) {
            console.error(e)
        }
    }

    const cancelEdit = () => {
        setModalVisible(false);
        router.push('/')
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
                            placeholder={list?.title || 'Edit List'}
                            placeholderTextColor="gray"
                            value={list?.title || ''}
                            onChangeText={(text) => setList(prev => ({ ...prev, title: text }))}
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
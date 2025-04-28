import { View, Text, StyleSheet, Pressable, TextInput, Modal, FlatList } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { useLocalSearchParams, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SafeAreaView } from "react-native-safe-area-context"
import { ThemeContext } from "@/context/ThemeContext"
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter"
import { fetchLists } from "@/data/todos"


export default function EditListScreen() {
    const { id, prev } = useLocalSearchParams()
    const [ list, setList ] = useState([])
    const { colorScheme, theme } = useContext(ThemeContext)
    const router = useRouter()
    const [loaded, error] = useFonts({ Inter_500Medium })
    const [isModalVisible, setModalVisible] = useState(true)
    const [darkColour, setDarkColour] = useState(theme.text)
    const [lightColour, setightColour] = useState(theme.text)
    const [colourId, setColourId] = useState(0)

    const colours = [
        { id: '1', darkColour: 'darkred', lightColour: 'lightcoral' },
        { id: '2', darkColour: 'darkgreen' , lightColour: 'lightgreen' },
        { id: '3', darkColour: 'darkblue' , lightColour: 'lightskyblue' },
        { id: '4', darkColour: 'rebeccapurple', lightColour: 'plum' },
    ]

    useEffect(() => {
        fetchLists((lists) => {
            const myList = lists.find(list => list.id.toString() === id)
            setList(myList)
            setColourId(myList.colourId)
            console.log('Fetched list ', id)
        })
    }, [setList])
    
    if (!loaded && !error) {
        return null
    }

    const styles = createStyles(theme, colorScheme)

    const handleSave = async () => {
        try {
            const savedList = { 
                ...list, 
                title: list.title, 
                colourId: colourId,
                darkcolour: darkColour,
                lightcolour: lightColour,
                lastEdited: new Date().toISOString() }

            const jsonValue = await AsyncStorage.getItem('TodoLists')
            const storageLists = jsonValue != null && jsonValue != 'undefined' ? JSON.parse(jsonValue) : null
            
            if (storageLists && storageLists.length) {
                const otherLists = storageLists.filter(list => list.id !== savedList.id)
                const allLists = [...otherLists, savedList]
                await AsyncStorage.setItem('TodoLists', JSON.stringify(allLists))
            } else {
                await AsyncStorage.setItem('TodoLists', JSON.stringify([savedList]))
            }

            setModalVisible(false)
            router.push(prev)
        } catch (e) {
            console.error(e)
        }
    }

    const cancelEdit = () => {
        setModalVisible(false)
        router.push(prev)
    }

    const renderColourButton = ({item}) => {
        console.log('colourId: ', colourId, ' ,item.colourId: ', item.id)
        return (
          <Pressable 
            onPress={() => selectColour(item.id, item.darkColour, item.lightColour)}
            style={[
              styles.colourButton,
              {
                backgroundColor: theme === 'light' ? item.darkColour : item.lightColour,
                borderWidth: colourId === item.id.toString() ? 4 : 1,
                borderColor: theme.text,
              },
            ]}
          />
        );
      }
    
    const selectColour = (id, dark, light) => {
        console.log('select edit colour: ', dark)
        setColourId(id)
        setDarkColour(dark)
        setightColour(light)
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
                    <Text style={styles.title}>Edit List</Text>
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
                    <View style={styles.colourpicker}>
                        <Text style={[styles.title, {fontSize: 18}]}>Pick Colour: </Text>
                        <View style={{alignContent: 'flex-end'}}>
                            <FlatList
                                data={colours}
                                renderItem={renderColourButton}
                                keyExtractor={(item) => item.id.toString()}
                                horizontal
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Pressable
                            style={styles.button}
                            onPress={handleSave}
                        >
                            <Text style={styles.buttonText}>Save</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, { backgroundColor: 'red' }]}
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
            maxWidth: 400,
            maxHeight: 250,
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
        colourpicker: {
            flexDirection: 'row',
            marginTop: 10,
        },  
        colourButton: {
            borderRadius: 5,
            width: 30, 
            height: 30,
            margin: 10,
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
        button: {
            backgroundColor: theme.button,
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
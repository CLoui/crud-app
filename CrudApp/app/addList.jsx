import { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Modal, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { fetchLists, saveLists } from "../data/todos";
import { ThemeContext } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";


// Screen to add new to do list
export default function AddListScreen() {
  const [title, setTitle] = useState("");
  const [loaded, error] = useFonts({ Inter_500Medium });
  const { colorScheme, theme } = useContext(ThemeContext);
  const [darkColour, setDarkColour] = useState(theme.text);
  const [lightColour, setightColour] = useState(theme.text);
  const [colourId, setColourId] = useState(0);
  const [isModalVisible, setModalVisible] = useState(true);
  const router = useRouter();
  
  // Set of colours for user to pick from
  const colours = [
    { id: 1, darkColour: 'darkred', lightColour: 'lightcoral' },
    { id: 2, darkColour: 'darkgreen' , lightColour: 'lightgreen' },
    { id: 3, darkColour: 'darkblue' , lightColour: 'lightblue' },
    { id: 4, darkColour: 'rebeccapurple', lightColour: 'plum' },
  ];

  // Check if font has loaded properly
  if (!loaded && !error) {
    return null;
  }

  // Create style sheet for this specific screen
  const styles = createStyles(theme, colorScheme);

  // Handle adding new to do list 
  const handleAddList = () => {
    if (title.trim()) {
      fetchLists((lists) => {
        const newList = { 
          id: Date.now(), 
          title,
          colourId: colourId,
          darkcolour: darkColour, 
          lightcolour: lightColour, 
          todos: [],
          lastEdited: new Date().toISOString() 
        };
        // Add this todo list to list of all todo lists
        const updatedLists = [...lists, newList]
        saveLists(updatedLists)
      });
    };
    setTitle("");
    setModalVisible(false);
    router.push("/"); // Navigate back to the index screen
  };

  // Cancel adding a new list
  const cancelAdd = () => {
    setTitle("");
    setModalVisible(false);
    router.push("/");
  };

  // Render row of buttons for user to select colour from
  const renderColourButton = ({item}) => {
    return (
      <Pressable 
        onPress={() => selectColour(item.id, item.darkColour, item.lightColour)}
        style={[
          styles.colourButton,
          {
            backgroundColor: theme === 'light' ? item.darkColour : item.lightColour,
            borderWidth: colourId === item.id ? 3 : 1,
            borderColor: theme.text,
          },
        ]}
      />
    );
  };

  // Save colour details when the user picks a colour from colour picker
  const selectColour = (id, dark, light) => {
    setColourId(id)
    setDarkColour(dark)
    setightColour(light)
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => cancelEdit()}
      >
        <View style={[styles.inputContainer, {flexDirection: 'column', justifyContent: "center", flex: 1,}]}>
          <Text style={styles.title}>Add List</Text>
          {/* Text input for list title */}
          <View>
            <TextInput
            style={styles.input}
            placeholder="List Title"
            maxLength={30}
            value={title}
            onChangeText={setTitle}
            />
          </View>
          {/* Row of buttons to select a colour */}
          <View style={styles.colourpicker}>
            <Text style={[styles.title, {fontSize: 18, marginTop: 10}]}>Pick Colour: </Text>
            <View style={{alignContent: 'flex-end'}}>
              <FlatList
                data={colours}
                renderItem={renderColourButton}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                contentContainerStyle={{ marginTop: 10 }}
              />
            </View>
          </View>
          {/* Add list and cancel buttons */}
          <View style={{flexDirection: 'row'}}>
            <Pressable onPress={handleAddList} style={styles.addButton}>
              <Text style={styles.buttonText}>Add List</Text>
            </Pressable>
            <Pressable onPress={cancelAdd} style={styles.cancelButton}>
              <Text style={[styles.buttonText, { color: 'white' }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>  
  );
};

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
    colourpicker: {
      flexDirection: 'row'
    },  
    colourButton: {
      borderRadius: 5,
      width: 30, 
      height: 30,
      margin: 10
    },
    buttonText: {
      fontSize: 18,
      color: colorScheme === 'dark' ? 'black' : 'white',
    },
    cancelButton: {
      backgroundColor: 'red',
      borderRadius: 5,
      padding: 10,
      margin: 10,
    },
    title: {
      flex: 1,
      fontSize: 24,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
      margin: 10,
      marginTop: 10,
    },
  });
};
import { useState } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { fetchLists, saveLists } from "../data/todos";
import { useRouter } from "expo-router";

export default function AddListScreen() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleAddList = () => {
    if (title.trim()) {
      fetchLists((lists) => {
        const newList = { id: Date.now(), title, todos: [] };
        const updatedLists = [...lists, newList];
        saveLists(updatedLists);
        setTitle("");
        router.push("/"); // Navigate back to the lists screen
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="List Title"
        value={title}
        onChangeText={setTitle}
      />
      <Pressable onPress={handleAddList} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add List</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
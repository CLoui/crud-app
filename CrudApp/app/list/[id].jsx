import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { fetchLists } from "../../data/todos";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function TodosScreen() {
  const { id } = useLocalSearchParams(); // Get the listId from the route
  const [todos, setTodos] = useState([]);
    const router = useRouter()
    
  useEffect(() => {
    fetchLists((lists) => {
      const list = lists.find((list) => list.id === parseInt(id));
      setTodos(list ? list.todos : []);
    });
  }, [id]);

  return (
    <View style={styles.container}>
      {todos.map((todo) => (
        <Text key={todo.id} style={styles.todoItem}>
          {todo.title}
        </Text>
      ))}
    </View>

    // <Animated.FlatList
        // style={styles.starredList}
        // data={todos.filter(todo => todo.starred === true)}
        // renderItem={renderItem}
        // keyExtractor={todo => todo.id}
        // contentContainerStyle={{ flexGrow: 1 }}
        // itemLayoutAnimation={LinearTransition}
        // keyboardDismissMode="on-drag" 
    // />
    // <Animated.FlatList
    // data={todos.filter(todo => todo.starred === false)}
    // renderItem={renderItem}
    // keyExtractor={todo => todo.id}
    // contentContainerStyle={{ flexGrow: 1 }}
    // itemLayoutAnimation={LinearTransition}
    // keyboardDismissMode="on-drag"
    // />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  todoItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
});
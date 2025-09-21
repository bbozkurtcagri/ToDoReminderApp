// app/(tabs)/index.tsx

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AddTaskModal from '../../components/AddTaskModal';

type Task = {
  id: string;
  title: string;
  done: boolean;
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets(); // 👈 cihazın çentik bilgisi
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleDone = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const onAddTask = (title: string) => {
    const newTask = { id: Date.now().toString(), title, done: false };
    setTasks(prev => [newTask, ...prev]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* + butonu */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.addButton, { top: insets.top + 10 }]} // 👈 dinamik top padding
      >
        <Ionicons name="add-circle-outline" size={32} color="#007aff" />
      </TouchableOpacity>

      {/* Başlık */}
      <Text style={styles.title}>📝 Yapılacaklar</Text>

      {/* Liste */}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleDone(item.id)} style={styles.taskItem}>
            <Text style={[styles.taskText, item.done && styles.taskDone]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal */}
      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTask={onAddTask}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  taskItem: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 18,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  addButton: {
    position: 'absolute',
    right: 10,
    zIndex: 1000,
    elevation: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
  },
});

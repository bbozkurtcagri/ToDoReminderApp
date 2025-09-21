// app/(tabs)/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AddTaskModal from '../../components/AddTaskModal';

// 🔽 EKLE: hook'u içeri al
import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const { tasks, loading, addTask, toggleTask } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);

  const onToggle = (id: string) => toggleTask(id);

  const onAddTask = (title: string) => {
    addTask(title);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Yükleniyor…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* + butonu */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.addButton, { top: insets.top + 10 }]}
      >
        <Ionicons name="add-circle-outline" size={32} color="#007aff" />
      </TouchableOpacity>

      {/* Başlık */}
      <Text style={styles.title}>📝 Yapılacaklar</Text>

      <Text style={{ marginBottom: 8, color: '#555' }}>
        Toplam {tasks.length} • Tamamlanan {tasks.filter(t => t.completed).length}
      </Text>

      {/* Liste */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onToggle(item.id)} style={styles.taskItem}>
            {/* 🔽 item.completed kullanıyoruz */}
            <Text style={[styles.taskText, item.completed && styles.taskDone]}>
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
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 20 },
  taskItem: { backgroundColor: '#f2f2f2', padding: 15, borderRadius: 10, marginBottom: 10 },
  taskText: { fontSize: 18 },
  taskDone: { textDecorationLine: 'line-through', color: 'gray' },
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

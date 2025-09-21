import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AddTaskModal from '../../components/AddTaskModal';
import EditTaskModal from '../../components/EditTaskModal';
import { useTasks } from '../../hooks/useTasks';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasks();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] =
    useState<{ id: string; title: string } | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      {/* + butonu (mevcuttu, istersen geri ekleyebilirsin) */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.addButton, { top: insets.top + 10 }]}
      >
        <Ionicons name="add-circle-outline" size={32} color="#007aff" />
      </TouchableOpacity>

      {/* Başlık */}
      <Text style={styles.title}>📝 Yapılacaklar</Text>

      {/* Sayaç: NEDEN → kullanıcıya anlık durum bilgisi */}
      <Text style={{ marginBottom: 8, color: '#555' }}>
        Toplam {tasks.length} • Tamamlanan{' '}
        {tasks.filter((t) => t.completed).length}
      </Text>

      {/* Liste: NEDEN → her satırda sol: başlık, sağ: düzenle/sil ikonları */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            {/* Tamamlama toggle */}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => toggleTask(item.id)}
            >
              <Text style={[styles.taskText, item.completed && styles.taskDone]}>
                {item.title}
              </Text>
            </TouchableOpacity>

            {/* Düzenle */}
            <TouchableOpacity onPress={() => setEditingTask(item)}>
              <Ionicons
                name="pencil"
                size={20}
                color="#007aff"
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>

            {/* Sil */}
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Yeni görev ekleme modalı: NEDEN → id/flag üretimi hook'ta, modal sadece title döner */}
      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTask={(title) => {
          addTask(title);
          setModalVisible(false);
        }}
      />

      {/* Düzenleme modalı: NEDEN → UI ayrı komponent, iş mantığı hook'ta */}
      {editingTask && (
        <EditTaskModal
          visible={!!editingTask}
          initialTitle={editingTask.title}
          onClose={() => setEditingTask(null)}
          onSave={(newTitle) => updateTask(editingTask.id, newTitle)}
        />
      )}
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
    marginBottom: 12,
    marginTop: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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

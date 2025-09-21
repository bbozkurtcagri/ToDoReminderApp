import { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddTask: (title: string) => void;
};

export default function AddTaskModal({ visible, onClose, onAddTask }: Props) {
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (title.trim().length > 0) {
      onAddTask(title.trim());
      setTitle('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.label}>Yeni Görev</Text>
          <TextInput
            placeholder="Bir şey yaz..."
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <View style={styles.buttons}>
            <TouchableOpacity onPress={onClose} style={styles.cancel}>
              <Text>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAdd} style={styles.add}>
              <Text style={{ color: 'white' }}>Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modal: {
    backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%'
  },
  label: {
    fontSize: 18, fontWeight: 'bold', marginBottom: 10
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15
  },
  buttons: {
    flexDirection: 'row', justifyContent: 'flex-end', gap: 10
  },
  cancel: {
    padding: 10
  },
  add: {
    backgroundColor: '#007aff', padding: 10, borderRadius: 8
  }
});

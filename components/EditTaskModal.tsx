import { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type Props = {
  visible: boolean;
  initialTitle: string;
  onClose: () => void;
  onSave: (newTitle: string) => void;
};

export default function EditTaskModal({
  visible,
  initialTitle,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState(initialTitle);

  // modal her açıldığında inputu mevcut başlığa eşitle
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle, visible]);

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave(trimmed);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Görevi Düzenle</Text>

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Yeni başlık yaz…"
            placeholderTextColor="#9aa0a6"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Vazgeç</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSave} style={styles.primaryBtn}>
              <Text style={styles.primaryText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  cancelText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#007aff',
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

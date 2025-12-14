import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddNote: (title: string, content: string, reminderAt?: string) => void;
};

export default function AddNoteModal({ visible, onClose, onAddNote }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [reminderDate, setReminderDate] = useState<Date | null>(null);

  const handleAdd = () => {
    if (title.trim().length > 0) {
      onAddNote(
        title.trim(),
        content.trim(),
        reminderDate ? reminderDate.toISOString() : undefined
      );
      // Reset form
      setTitle('');
      setContent('');
      setReminderDate(null);
      setShowReminderPicker(false);
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setReminderDate(null);
    setShowReminderPicker(false);
    onClose();
  };

  const setReminderInMinutes = (minutes: number) => {
    const date = new Date();
    if (minutes < 1) {
      // For seconds (e.g., 0.167 = 10 seconds)
      date.setSeconds(date.getSeconds() + Math.round(minutes * 60));
    } else {
      date.setMinutes(date.getMinutes() + minutes);
    }
    setReminderDate(date);
    setShowReminderPicker(false);
  };

  const formatReminderDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes} dakika sonra`;
    if (hours < 24) return `${hours} saat sonra`;
    return `${days} gün sonra`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Yeni Not</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
            <TextInput
              style={styles.titleInput}
              placeholder="Başlık..."
              placeholderTextColor="#9aa0a6"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />

            <TextInput
              style={styles.contentInput}
              placeholder="Not içeriği..."
              placeholderTextColor="#9aa0a6"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />

            {/* Hatırlatıcı Bölümü */}
            <View style={styles.reminderSection}>
              <TouchableOpacity
                style={styles.reminderButton}
                onPress={() => setShowReminderPicker(!showReminderPicker)}
              >
                <Ionicons
                  name={reminderDate ? 'notifications' : 'notifications-outline'}
                  size={20}
                  color={reminderDate ? '#007aff' : '#666'}
                />
                <Text style={[styles.reminderText, reminderDate && styles.reminderTextActive]}>
                  {reminderDate
                    ? formatReminderDate(reminderDate)
                    : 'Hatırlatıcı ekle'}
                </Text>
                {reminderDate && (
                  <TouchableOpacity
                    onPress={() => setReminderDate(null)}
                    style={styles.removeReminder}
                  >
                    <Ionicons name="close-circle" size={20} color="#ff3b30" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {showReminderPicker && (
                <View style={styles.reminderOptions}>
                  <TouchableOpacity
                    style={styles.reminderOption}
                    onPress={() => setReminderInMinutes(0.167)} // 10 saniye
                  >
                    <Text style={styles.reminderOptionText}>10 saniye sonra</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reminderOption}
                    onPress={() => setReminderInMinutes(1)} // 1 dakika
                  >
                    <Text style={styles.reminderOptionText}>1 dakika sonra</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reminderOption}
                    onPress={() => setReminderInMinutes(15)}
                  >
                    <Text style={styles.reminderOptionText}>15 dakika sonra</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reminderOption}
                    onPress={() => setReminderInMinutes(60)}
                  >
                    <Text style={styles.reminderOptionText}>1 saat sonra</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reminderOption}
                    onPress={() => setReminderInMinutes(1440)}
                  >
                    <Text style={styles.reminderOptionText}>1 gün sonra</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reminderOption}
                    onPress={() => setReminderInMinutes(10080)}
                  >
                    <Text style={styles.reminderOptionText}>1 hafta sonra</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.reminderOption, styles.customOption]}
                    onPress={() => {
                      setShowReminderPicker(false);
                      setShowDateTimePicker(true);
                    }}
                  >
                    <Ionicons name="calendar-outline" size={18} color="#007aff" />
                    <Text style={[styles.reminderOptionText, styles.customOptionText]}>
                      Özel zaman seç
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {showDateTimePicker && (
                <View style={styles.dateTimePickerContainer}>
                  <DateTimePicker
                    value={reminderDate || new Date()}
                    mode="datetime"
                    is24Hour={true}
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      if (Platform.OS === 'android') {
                        setShowDateTimePicker(false);
                      }
                      if (selectedDate) {
                        setReminderDate(selectedDate);
                        if (Platform.OS === 'ios') {
                          setShowDateTimePicker(false);
                        }
                      }
                    }}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  />
                  {Platform.OS === 'ios' && (
                    <View style={styles.dateTimePickerActions}>
                      <TouchableOpacity
                        onPress={() => {
                          setShowDateTimePicker(false);
                          setReminderDate(null);
                        }}
                        style={styles.dateTimePickerCancel}
                      >
                        <Text style={styles.dateTimePickerCancelText}>İptal</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setShowDateTimePicker(false)}
                        style={styles.dateTimePickerConfirm}
                      >
                        <Text style={styles.dateTimePickerConfirmText}>Tamam</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAdd} style={styles.saveBtn}>
              <Text style={styles.saveText}>Kaydet</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  scrollView: {
    maxHeight: 400,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  contentInput: {
    fontSize: 16,
    minHeight: 120,
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  reminderSection: {
    marginBottom: 16,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
  },
  reminderText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  reminderTextActive: {
    color: '#007aff',
    fontWeight: '600',
  },
  removeReminder: {
    marginLeft: 'auto',
  },
  reminderOptions: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  reminderOption: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  reminderOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  customOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 4,
    paddingTop: 12,
  },
  customOptionText: {
    color: '#007aff',
    fontWeight: '600',
  },
  dateTimePickerContainer: {
    marginTop: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
  },
  dateTimePickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  dateTimePickerCancel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateTimePickerCancelText: {
    fontSize: 16,
    color: '#666',
  },
  dateTimePickerConfirm: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#007aff',
    borderRadius: 8,
  },
  dateTimePickerConfirmText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  cancelText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#007aff',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});


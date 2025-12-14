import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNotes } from '../../hooks/useNotes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { notes, updateNote, deleteNote, archiveNote } = useNotes();

  const note = notes.find(n => n.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Not bulunamadı</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (title.trim()) {
      updateNote(id, { title: title.trim(), content: content.trim() });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    deleteNote(id);
    router.back();
  };

  const handleArchive = () => {
    archiveNote(id);
    router.back();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          {isEditing ? (
            <>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.saveText}>Kaydet</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={handleArchive} style={styles.iconButton}>
                <Ionicons name="archive-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.iconButton}>
                <Ionicons name="pencil" size={24} color="#007aff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
                <Ionicons name="trash-outline" size={24} color="#ff3b30" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scrollView}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Başlık..."
                placeholderTextColor="#9aa0a6"
                autoFocus
              />
              <TextInput
                style={styles.contentInput}
                value={content}
                onChangeText={setContent}
                placeholder="Not içeriği..."
                placeholderTextColor="#9aa0a6"
                multiline
                textAlignVertical="top"
              />
            </>
          ) : (
            <>
              <Text style={styles.titleDisplay}>{note.title}</Text>
              {note.content && <Text style={styles.contentDisplay}>{note.content}</Text>}
              <View style={styles.metaInfo}>
                <Text style={styles.metaText}>
                  Oluşturulma: {formatDate(note.createdAt)}
                </Text>
                {note.updatedAt !== note.createdAt && (
                  <Text style={styles.metaText}>
                    Güncellenme: {formatDate(note.updatedAt)}
                  </Text>
                )}
                {note.reminderAt && (
                  <View style={styles.reminderInfo}>
                    <Ionicons name="notifications" size={16} color="#007aff" />
                    <Text style={styles.reminderText}>
                      Hatırlatıcı: {formatDate(note.reminderAt)}
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  saveText: {
    fontSize: 16,
    color: '#007aff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  contentInput: {
    fontSize: 16,
    color: '#374151',
    padding: 16,
    minHeight: 200,
    lineHeight: 24,
  },
  titleDisplay: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    padding: 16,
    paddingBottom: 8,
  },
  contentDisplay: {
    fontSize: 16,
    color: '#374151',
    padding: 16,
    paddingTop: 8,
    lineHeight: 24,
  },
  metaInfo: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginTop: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  reminderText: {
    fontSize: 14,
    color: '#007aff',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 40,
  },
});


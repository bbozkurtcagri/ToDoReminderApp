import { Ionicons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNotes } from '../../hooks/useNotes';
import { Note } from '../../types/Note';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ArchiveScreen() {
  const insets = useSafeAreaInsets();
  const { archivedNotes, deleteNote, unarchiveNote } = useNotes();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return archivedNotes;

    const query = searchQuery.toLowerCase();
    return archivedNotes.filter(
      note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [archivedNotes, searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <View style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.noteDate}>{formatDate(item.updatedAt)}</Text>
      </View>

      {item.content && (
        <Text style={styles.noteContent} numberOfLines={2}>
          {item.content}
        </Text>
      )}

      <View style={styles.noteActions}>
        <TouchableOpacity
          onPress={async () => {
            await unarchiveNote(item.id);
            // Force re-render by navigating away and back, or just wait for state update
          }}
          style={[styles.actionButton, styles.restoreButton]}
        >
          <Ionicons name="arrow-undo-outline" size={18} color="#007aff" />
          <Text style={styles.restoreText}>Geri Al</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteNote(item.id)}
          style={styles.actionButton}
        >
          <Ionicons name="trash-outline" size={18} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.title}>📦 Arşiv</Text>
        <Text style={styles.subtitle}>
          {archivedNotes.length} arşivlenmiş not
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9aa0a6" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Arşivde ara..."
          placeholderTextColor="#9aa0a6"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9aa0a6" />
          </TouchableOpacity>
        )}
      </View>

      {filteredNotes.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="archive-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'Arama sonucu bulunamadı' : 'Arşiv boş'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {searchQuery
              ? 'Farklı bir arama terimi deneyin'
              : 'Arşivlenmiş notlar burada görünecek'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={item => item.id}
          renderItem={renderNoteItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  listContent: {
    padding: 20,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    opacity: 0.8,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  noteDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 8,
  },
  noteContent: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
    padding: 6,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  restoreText: {
    fontSize: 14,
    color: '#007aff',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});


import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { Note } from '../types/Note';

const STORAGE_KEY = 'notes:v1';

// Notification handler configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notes from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const loadedNotes = JSON.parse(json) as Note[];
          setNotes(loadedNotes);
          
          // Schedule notifications for reminders
          await scheduleAllReminders(loadedNotes);
        }
      } catch (e) {
        console.warn('notes load error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Save notes to storage whenever notes change
  useEffect(() => {
    if (loading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes)).catch(e =>
      console.warn('notes save error', e)
    );
  }, [notes, loading]);

  // Request notification permissions
  const requestPermissions = useCallback(async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }, []);

  // Schedule a notification for a reminder
  const scheduleReminder = useCallback(async (noteId: string, reminderAt: string) => {
    try {
      fetch('http://127.0.0.1:7242/ingest/6b33cfe5-0dd4-44d3-b249-badd4a5b28f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNotes.ts:56',message:'scheduleReminder called',data:{noteId,reminderAt},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        fetch('http://127.0.0.1:7242/ingest/6b33cfe5-0dd4-44d3-b249-badd4a5b28f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNotes.ts:60',message:'Permission denied',data:{noteId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        console.warn('Notification permission not granted');
        return;
      }

      const reminderDate = new Date(reminderAt);
      const now = new Date();

      fetch('http://127.0.0.1:7242/ingest/6b33cfe5-0dd4-44d3-b249-badd4a5b28f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNotes.ts:67',message:'Date check',data:{reminderAt,reminderDate:reminderDate.toISOString(),now:now.toISOString(),isFuture:reminderDate>now},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});

      // Only schedule if reminder is in the future
      if (reminderDate <= now) {
        fetch('http://127.0.0.1:7242/ingest/6b33cfe5-0dd4-44d3-b249-badd4a5b28f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNotes.ts:69',message:'Reminder in past, skipping',data:{noteId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        return;
      }

      fetch('http://127.0.0.1:7242/ingest/6b33cfe5-0dd4-44d3-b249-badd4a5b28f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNotes.ts:80',message:'Scheduling notification with date',data:{noteId,reminderDate:reminderDate.toISOString(),triggerType:'date'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📝 Hatırlatıcı',
          body: `Notunuzu kontrol etmeyi unutmayın!`,
          data: { noteId },
          sound: true,
        },
        trigger: {
          type: 'date',
          date: reminderDate,
        } as any,
        identifier: `reminder-${noteId}`,
      });
      
      fetch('http://127.0.0.1:7242/ingest/6b33cfe5-0dd4-44d3-b249-badd4a5b28f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNotes.ts:90',message:'Notification scheduled successfully',data:{noteId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    } catch (error) {
      fetch('http://127.0.0.1:7242/ingest/6b33cfe5-0dd4-44d3-b249-badd4a5b28f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNotes.ts:92',message:'Notification schedule error',data:{noteId,error:error instanceof Error?error.message:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }, [requestPermissions]);

  // Schedule all reminders for loaded notes
  const scheduleAllReminders = useCallback(async (notesList: Note[]) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    // Cancel all existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule new ones
    for (const note of notesList) {
      if (note.reminderAt && !note.isArchived) {
        await scheduleReminder(note.id, note.reminderAt);
      }
    }
  }, [requestPermissions, scheduleReminder]);

  // Cancel a reminder notification
  const cancelReminder = useCallback(async (noteId: string) => {
    await Notifications.cancelScheduledNotificationAsync(`reminder-${noteId}`);
  }, []);

  // Add a new note
  const addNote = useCallback((title: string, content: string = '', reminderAt?: string) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
      reminderAt,
      isArchived: false,
    };

    setNotes(prev => [newNote, ...prev]);

    // Schedule reminder if provided
    if (reminderAt) {
      scheduleReminder(newNote.id, reminderAt);
    }
  }, [scheduleReminder]);

  // Update a note
  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note => {
        if (note.id === id) {
          const updated = {
            ...note,
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          // Handle reminder changes
          if (updates.reminderAt !== undefined) {
            if (updates.reminderAt) {
              scheduleReminder(id, updates.reminderAt);
            } else {
              cancelReminder(id);
            }
          }

          return updated;
        }
        return note;
      })
    );
  }, [scheduleReminder, cancelReminder]);

  // Delete a note
  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    cancelReminder(id);
  }, [cancelReminder]);

  // Archive a note
  const archiveNote = useCallback((id: string) => {
    updateNote(id, { isArchived: true });
    cancelReminder(id);
  }, [updateNote, cancelReminder]);

  // Unarchive a note
  const unarchiveNote = useCallback(
    async (id: string) => {
      fetch('http://127.0.0.1:7242/ingest/6b33cfe5-0dd4-44d3-b249-badd4a5b28f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNotes.ts:165',message:'unarchiveNote called',data:{id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      
      setNotes(prev => {
        const note = prev.find(n => n.id === id);
        fetch('http://127.0.0.1:7242/ingest/6b33cfe5-0dd4-44d3-b249-badd4a5b28f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNotes.ts:168',message:'Note found in state',data:{id,found:!!note,isArchived:note?.isArchived,reminderAt:note?.reminderAt},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        
        if (note) {
          const updated = { ...note, isArchived: false, updatedAt: new Date().toISOString() };
          const newNotes = prev.map(n => (n.id === id ? updated : n));
          
          fetch('http://127.0.0.1:7242/ingest/6b33cfe5-0dd4-44d3-b249-badd4a5b28f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNotes.ts:175',message:'State updated',data:{id,newNotesCount:newNotes.length,activeCount:newNotes.filter(n=>!n.isArchived).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          
          // Schedule reminder if it exists (async, but don't wait)
          if (note.reminderAt) {
            scheduleReminder(id, note.reminderAt).catch(e => {
              fetch('http://127.0.0.1:7242/ingest/6b33cfe5-0dd4-44d3-b249-badd4a5b28f8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useNotes.ts:179',message:'Reminder schedule error',data:{id,error:e instanceof Error?e.message:String(e)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
              console.warn('Reminder schedule error', e);
            });
          }
          return newNotes;
        }
        return prev;
      });
    },
    [scheduleReminder]
  );

  // Get active notes (not archived)
  const activeNotes = notes.filter(note => !note.isArchived);

  // Get archived notes
  const archivedNotes = notes.filter(note => note.isArchived);

  // Get notes with reminders
  const notesWithReminders = notes.filter(note => note.reminderAt && !note.isArchived);

  return {
    notes,
    activeNotes,
    archivedNotes,
    notesWithReminders,
    loading,
    addNote,
    updateNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
    requestPermissions,
  };
}


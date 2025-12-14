export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  reminderAt?: string; // ISO date string, optional
  category?: string; // Kategori (opsiyonel)
  isArchived: boolean;
  color?: string; // Not rengi (opsiyonel)
};

export type NoteCategory = {
  id: string;
  name: string;
  color: string;
};


import { Note } from './Note';

export interface User {
  name: string;
  description: string;
  currentPassword?: string;
  id: string;
  userRole: string;
  suspended: boolean;
  notes: Note[];
}

import type { IReader } from '../types/reader.types';

export const mockReaders: IReader[] = [
  {
    id: 'r1',
    fullName: 'Иван Петров',
    email: 'ivan@mail.ru',
    phone: '+7-999-123-45-67',
    registrationDate: new Date('2024-01-15'),
    booksHistory: [
      { bookId: '2', takenAt: new Date('2024-02-01'), returnedAt: new Date('2024-03-15') },
      { bookId: '1', takenAt: new Date('2024-08-15') }
    ],
    activeBooks: ['1']
  },
  {
    id: 'r2',
    fullName: 'Мария Иванова',
    email: 'maria@mail.ru',
    phone: '+7-999-234-56-78',
    registrationDate: new Date('2024-02-20'),
    booksHistory: [
      { bookId: '2', takenAt: new Date('2024-05-10') }
    ],
    activeBooks: ['2']
  }
];

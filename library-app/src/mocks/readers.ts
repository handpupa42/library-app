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
      { bookId: '3', takenAt: new Date('2024-03-20'), returnedAt: new Date('2024-04-10') },
      { bookId: '5', takenAt: new Date('2024-05-01'), returnedAt: new Date('2024-06-20') },
      { bookId: '6', takenAt: new Date('2024-07-10'), returnedAt: new Date('2024-08-01') },
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
      { bookId: '4', takenAt: new Date('2024-03-01'), returnedAt: new Date('2024-04-15') },
      { bookId: '2', takenAt: new Date('2024-05-10') }
    ],
    activeBooks: ['2']
  },
  {
    id: 'r3',
    fullName: 'Пётр Сидоров',
    email: 'petr@mail.ru',
    phone: '+7-999-345-67-89',
    registrationDate: new Date('2024-03-10'),
    booksHistory: [
      { bookId: '1', takenAt: new Date('2024-04-01'), returnedAt: new Date('2024-05-20') },
      { bookId: '3', takenAt: new Date('2024-06-10'), returnedAt: new Date('2024-07-25') },
      { bookId: '5', takenAt: new Date('2024-08-01'), returnedAt: new Date('2024-09-15') }
    ],
    activeBooks: []
  },
  {
    id: 'r4',
    fullName: 'Елена Смирнова',
    email: 'elena@mail.ru',
    phone: '+7-999-456-78-90',
    registrationDate: new Date('2024-04-05'),
    booksHistory: [
      { bookId: '6', takenAt: new Date('2024-05-01'), returnedAt: new Date('2024-06-10') },
      { bookId: '4', takenAt: new Date('2024-07-01'), returnedAt: new Date('2024-08-20') },
      { bookId: '1', takenAt: new Date('2024-09-01') },
      { bookId: '2', takenAt: new Date('2024-09-01') },
      { bookId: '3', takenAt: new Date('2024-09-01') }
    ],
    activeBooks: ['1', '2', '3']
  },
  {
    id: 'r5',
    fullName: 'Алексей Новиков',
    email: 'alexey@mail.ru',
    phone: '+7-999-567-89-01',
    registrationDate: new Date('2024-05-12'),
    booksHistory: [
      { bookId: '5', takenAt: new Date('2024-06-01'), returnedAt: new Date('2024-07-15') },
      { bookId: '4', takenAt: new Date('2024-08-01') }
    ],
    activeBooks: ['4']
  }
];

import type { IReader } from '../types/reader.types';

export const mockReaders: IReader[] = [
  {
    id: 'r1',
    fullName: 'Иван Петров',
    email: 'ivan@mail.ru',
    phone: '+7-999-123-45-67',
    registrationDate: new Date('2024-01-15'),
    activeBooks: [
      { bookId: '1', title: 'Мастер и Маргарита', author: 'Михаил Булгаков', issuedDate: new Date('2024-08-15') }
    ],
    booksHistory: [
      { bookId: '2', title: 'Война и мир', author: 'Лев Толстой', issuedDate: new Date('2024-02-01'), returnedDate: new Date('2024-03-15') },
      { bookId: '3', title: 'Преступление и наказание', author: 'Фёдор Достоевский', issuedDate: new Date('2024-03-20'), returnedDate: new Date('2024-04-10') },
      { bookId: '1', title: 'Мастер и Маргарита', author: 'Михаил Булгаков', issuedDate: new Date('2024-08-15') }
    ]
  },
  {
    id: 'r2',
    fullName: 'Мария Иванова',
    email: 'maria@mail.ru',
    phone: '+7-999-234-56-78',
    registrationDate: new Date('2024-02-20'),
    activeBooks: [
      { bookId: '2', title: 'Война и мир', author: 'Лев Толстой', issuedDate: new Date('2024-05-10') }
    ],
    booksHistory: [
      { bookId: '4', title: 'Евгений Онегин', author: 'Александр Пушкин', issuedDate: new Date('2024-03-01'), returnedDate: new Date('2024-04-15') },
      { bookId: '2', title: 'Война и мир', author: 'Лев Толстой', issuedDate: new Date('2024-05-10') }
    ]
  }
];
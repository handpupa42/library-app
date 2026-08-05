export interface IBookHistory {
    bookId: string;
    takenAt: Date;
    returnedAt?: Date;           // опционально (если не возвращена)
  }
  
  export interface IReader {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    registrationDate: Date;
    booksHistory: IBookHistory[];
    activeBooks: string[];       // ID книг на руках
  }
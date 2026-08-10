export interface IActiveBook {
  bookId: string;
  title: string;
  author: string;
  issuedDate: Date;
}
export interface IBookHistory {
  bookId: string;
  title: string;
  author: string;
  issuedDate: Date;
  returnedDate?: Date; 
}
export interface IReader {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  registrationDate: Date;
  activeBooks: IActiveBook[];   // Книги на руках
  booksHistory: IBookHistory[]; // История
}
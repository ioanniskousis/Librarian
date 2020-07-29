/* eslint-disable import/extensions */
import { Book } from './library.js';

export default function dbSeed(libray) {
  libray.add(new Book(1, 'John Scipper', 'Elements of Choise', 234));
  libray.add(new Book(2, 'Dan Brown', 'Hit by the Light', 432));
  libray.add(new Book(3, 'Charly Humburg', 'Tournaments', 567, true));
  libray.add(new Book(4, 'Jack Flint', 'Fear of Fun', 1099));
  libray.add(new Book(5, 'William Timerlon', 'The Dust Of Horses', 608));
  libray.add(new Book(6, 'George Hamilton', 'Sand For Gold', 403, true));
}

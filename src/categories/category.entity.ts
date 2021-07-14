import { Book } from 'src/books/book.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  is_deleted: boolean;

  @OneToMany(() => Book, (book) => book.id)
  book: Book[];
}

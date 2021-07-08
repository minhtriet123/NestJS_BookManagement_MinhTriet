import { Author } from 'src/authors/author.entity';
import { Category } from 'src/categories/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @ManyToOne(() => Author, (author) => author.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @ManyToOne(() => Category, (author) => author.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  publish_year: string;

  @Column()
  price: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  cover: string;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  updatedAt: Date;
}

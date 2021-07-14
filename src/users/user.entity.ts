import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Exclude({ toPlainOnly: true })
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: '' })
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @Column({ default: '' })
  avatar: string;
}

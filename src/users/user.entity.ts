import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
enum Roles {
  user = 'user',
  admin = 'admin',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @Column({ default: '' })
  avatar: string;
}

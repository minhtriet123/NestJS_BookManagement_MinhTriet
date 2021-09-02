import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity('avatar-s3')
export class PublicFile {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public url: string;
 
  @Column()
  public key: string;
}
 

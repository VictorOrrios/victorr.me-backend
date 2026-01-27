import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column()
  link: string;

  @Column('text')
  text: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

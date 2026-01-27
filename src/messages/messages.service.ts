import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async createMessage(data: {
    name: string;
    avatar: string;
    link: string;
    text: string;
  }): Promise<Message> {
    const message = this.messageRepo.create(data);
    return this.messageRepo.save(message);
  }

  async getMessages(): Promise<Message[]> {
    return this.messageRepo.find({
      order: {
        createdAt: 'ASC',
      },
    });
  }
}

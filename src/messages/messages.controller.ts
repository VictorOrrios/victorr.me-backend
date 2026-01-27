import { Controller, Post, Get, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('api/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() body) {
    return this.messagesService.createMessage(body);
  }

  @Get()
  async findAll() {
    return this.messagesService.getMessages();
  }
}

import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagesService } from './messages/messages.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService, private readonly messagesService: MessagesService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('chat/callback')
  async chat_callback(@Query('code') code:string): Promise<string> {
    const url = "http://localhost:5173"
    const access_token = await this.appService.getAccessToken(code);
    return `
      <html>
        <body>
          <p>Redirecting to victorr.me, 
          if you aren't redirected press <a href="${url}">here</a></p>
          <script>
            window.opener.postMessage(
              ${JSON.stringify(access_token)}, 
              "${url}");
            window.close();
          </script>
        </body>
      </html>
    `;
  }

  @Get('chat')
  async chat_messages(@Query('code') code:string) {
    try {
      const msms = await this.messagesService.getMessages();
      return msms;
    } catch (err) {
        throw new Error('Error getting all messages', err);
    }
  }

  @Post('chat/send')
  async chat_send(
    @Body('access_token') access_token:string,
    @Body('text') text:string
  ) {
    try {
      if(text.length > 125) throw new Error('Text to long');
      const user = await this.appService.getUser(access_token)
      if(user === null) throw new Error('User not found');
      const msm = await this.messagesService.createMessage({
        name:user.name,
        avatar:user.avatar_url,
        link:user.html_url,
        text
      })
      return {
        id:msm.id,
        name:msm.name,
        avatar:msm.avatar,
        link:msm.link,
        date:msm.createdAt
      }
    } catch (err) {
        throw new Error('Error saving message', err);
    }
  }

}

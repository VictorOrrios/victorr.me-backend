import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Message } from './messages/message.entity';


@Injectable()
export class AppService {
  MessagesService: any;
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getCurrentFormattedDate(): string {
    const now = new Date();

    const day = String(now.getDate());
    const month = String(now.getMonth() + 1);
    const year = String(now.getFullYear()).slice(-2);

    const hours = String(now.getHours());
    const minutes = String(now.getMinutes());

    return `${day}/${month}/${year}@${hours}:${minutes}`;
  }

  async getAccessToken(code:string):Promise<string>{
    const url = 'https://github.com/login/oauth/access_token';
    
    const client_id = this.configService.get<string>('GITHUB_CLIENT_ID');
    const client_secret = this.configService.get<string>('GITHUB_CLIENT_SECRET');
    if(!client_id || !client_secret) throw new Error('Error obtaining client params from .env');

    try {
      const response = await axios.post(
        url,
        {
          client_id,
          client_secret,
          code,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error('Error obtaining access token from github:'+error.message);
    }
  }

  async getUser(access_token:string):Promise<any>{
      try {
          const res = await fetch('https://api.github.com/user', {
              headers: {
                  'Authorization': `Bearer ${access_token}`,
                  'Accept': 'application/json'
              }
          });

          if (res.ok) {
              return await res.json();
          } else if (res.status === 401) {
              return null;
          }
      } catch (err) {
        throw new Error('Error getting user', err);
      }
      
      return null;
  }
}

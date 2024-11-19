import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMethod(): string {
    return "API's are running.";
  }
}

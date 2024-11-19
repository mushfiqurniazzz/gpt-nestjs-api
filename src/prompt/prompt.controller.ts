import {
  Post,
  Get,
  Delete,
  Param,
  Controller,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { promptService } from './prompt.service';
import { Prompt } from './models/prompt.model';
import { Request } from 'express';

@Controller('prompt')
export class PromptController {
  constructor(private promptService: promptService) {}

  @Get()
  async findAllPrompts(): Promise<Prompt[]> {
    const data = await this.promptService.findAll();

    if (!data || data.length === 0) {
      throw new HttpException('No data found.', HttpStatus.NOT_FOUND);
    }

    return data;
  }

  @Post()
  async createPrompt(@Req() req: Request): Promise<Prompt> {
    const verifyAuth = req.headers.authorization.split('Bearer ')[1].trim();

    if (verifyAuth !== process.env.OPEN_AI_API) {
      throw new HttpException(
        'Not authorized to make a prompt.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const prompt = await this.promptService.create(req.body);

    return prompt;
  }

  @Get(':id')
  async getPromptById(@Param() id: string): Promise<Prompt> {
    const prompt = await this.promptService.findById(id);

    if (!prompt) {
      throw new HttpException('No prompt found.', HttpStatus.NOT_FOUND);
    }

    return prompt;
  }

  @Delete(':id')
  async deletePromptById(@Param() id: string): Promise<Prompt> {
    const deletedPrompt = await this.promptService.deleteById(id);

    if (!deletedPrompt) {
      throw new HttpException('No prompt found.', HttpStatus.NOT_FOUND);
    }

    return deletedPrompt;
  }
}

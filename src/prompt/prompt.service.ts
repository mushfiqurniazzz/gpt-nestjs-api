import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Prompt } from './models/prompt.model';
import OpenAI from 'openai';
import { create } from './zod/prompt.zod';
import { ZodError } from 'zod';

@Injectable()
export class promptService {
  constructor(
    @InjectModel(Prompt.name)
    private promptModel: mongoose.Model<Prompt>,
  ) {}

  async findAll(): Promise<Prompt[]> {
    const prompts = await this.promptModel.find();
    return prompts;
  }

  async create(promptInput: { promptInput: string }): Promise<Prompt> {
    try {
      const validateData = create.parse(promptInput);

      const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API,
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `${validateData.promptInput}` }],
      });

      const promptOutput = completion.choices[0].message;

      const promptDocument = await this.promptModel.create({
        promptInput: validateData.promptInput,
        promptOutput: promptOutput,
      });
      return promptDocument;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpException(
          {
            message: 'Error',
            error: error.errors[0].message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw error;
    }
  }

  async findById(promptid: string): Promise<Prompt> {
    const prompt = await this.promptModel.findById(promptid);

    if (!prompt) {
      throw new NotFoundException('Prompt not found.');
    }

    return prompt;
  }

  async deleteById(promptid: string): Promise<Prompt> {
    return await this.promptModel.findByIdAndDelete(promptid);
  }
}

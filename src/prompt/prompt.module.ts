import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { promptModel } from './models/prompt.model';
import { PromptController } from './prompt.controller';
import { promptService } from './prompt.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Prompt',
        schema: promptModel,
      },
    ]),
  ],
  controllers: [PromptController],
  providers: [promptService],
})
export class PromptModule {}

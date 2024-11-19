import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type promptDocument = HydratedDocument<Prompt>;

@Schema({ timestamps: true })
export class Prompt {
  @Prop({ required: true })
  promptInput: string;

  @Prop({ required: true })
  promptOutput: string;
}

export const promptModel = SchemaFactory.createForClass(Prompt);

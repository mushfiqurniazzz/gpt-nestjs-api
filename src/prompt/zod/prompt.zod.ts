import { z } from 'zod';

const create = z.object({
  promptInput: z.string({message:'Invalid data type.'}).min(1, 'Input is required.'),
});

export { create };

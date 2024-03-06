import OpenAI from 'openai';
import { OPEN_API_KEY } from './vars';

enum OPENAI_MODELS {
  GPT_3_5 = 'gpt-3.5-turbo-0125',
  // GPT_4 = 'gpt-4-0613',
  GPT_4 = 'gpt-4-0125-preview	',
  GPT_3_5_TURBO_1106 = 'gpt-3.5-turbo-0125',
  GPT_4_TURBO = 'gpt-4-1106-preview'
}

const DEFAULT_MODEL = OPENAI_MODELS.GPT_3_5_TURBO_1106;
// const DEFAULT_MODEL = OPENAI_MODELS.GPT_4;

const DEFAULT_SYSTEM_MESSAGE = "You are a helpul AI that helps people write impressive resumes. Please follow the instructions exactly";
const openai = new OpenAI({
  apiKey:OPEN_API_KEY.value(), // defaults to process.env["OPENAI_API_KEY"]
});
export { openai, OPENAI_MODELS , DEFAULT_MODEL, DEFAULT_SYSTEM_MESSAGE};
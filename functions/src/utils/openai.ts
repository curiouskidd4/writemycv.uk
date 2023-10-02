import OpenAI from 'openai';
import { OPEN_API_KEY } from './vars';



const openai = new OpenAI({
  apiKey:OPEN_API_KEY.value(), // defaults to process.env["OPENAI_API_KEY"]
});
export { openai };
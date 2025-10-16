import 'dotenv/config';
import { run } from '@openai/agents';
import { orchestrator } from './agents/orchestrator';
import readline from 'node:readline';

const INITIAL_PROMPT = `Hello, I am MollieGPT. I can help you with information about customers and their subscriptions. How can I assist you today? \n\n`;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question(INITIAL_PROMPT, async userquery => {
  const result = await run(
      orchestrator,
      userquery,
  );
  console.log(result.finalOutput);
  rl.close();
});
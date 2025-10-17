import 'dotenv/config';
import { Agent, AgentInputItem, run, StreamedRunResult } from '@openai/agents';
import { orchestrator } from './agents/orchestrator';
import readline from 'node:readline/promises';

const INITIAL_PROMPT = `Hello, I am MollieGPT. I can help you with information about customers and their subscriptions. How can I assist you today? \n\n`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main(){
  let result: StreamedRunResult<any, Agent<any, any>> | undefined;
  
  let userquery = await rl.question(INITIAL_PROMPT);
  const initialInput: AgentInputItem[] = [{role: 'user', content: userquery}];
  let session: { inputs: AgentInputItem[]} = { inputs: initialInput };

  while (true) {
    const inputs = session.inputs;
    
    result = await run(
        orchestrator,
        inputs,
        { stream: true }
    );

    result.toTextStream({ compatibleWithNodeStreams: true }).pipe(process.stdout);
    await result.completed;

    process.stdout.write('\n\n\n');
    userquery = await rl.question('');

    session = {
      inputs: [...result.history, {role: 'user', content: userquery}]
    }
  }
}

main().catch((error) => {
  console.error('Error in running the main function', error);
  process.exit(1);
});
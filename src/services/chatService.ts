import { Agent, AgentInputItem, run, RunState } from '@openai/agents';
import { orchestrator } from '../agents/orchestrator';
import { getApprovalMessageForInterruption } from '../utils/styling';

/**
 * Send a message to the LLM agents
 * @param message customer message
 * @param session request session (for now in memory)
 * @returns 
 */
export async function sendMessage(message: string, options: { inputs: Array<AgentInputItem> }) {
    const priorInputs = options.inputs || [];
    const response = await run(orchestrator, [...priorInputs, { role: 'user', content: message }]);
    return response;
}

/** 
 * Send state
 * @param stateInputs array of AgentInputItem representing the current state
 * @return
 */
export async function sendState(stateInputs: RunState<unknown, Agent<unknown, "text">>) {
    const response = await run(orchestrator, stateInputs);
    return response;
}

/**
 * Handles everything related to an incoming message, this function is meant to be extended in the future, with things like 
 * input validations, logging, and human-in-the-loop interventions.
 * @param message customer message
 * @param session request session (for now in memory)
 * @returns 
 */
export async function handleNewMessage(message: string, requestSession: any) {
    const { interruptions, interruption, state: stringifiedState, inputs } = requestSession;

    console.log('State before processing message:', { interruptions, interruption });
    const state = stringifiedState ? await RunState.fromString(orchestrator, stringifiedState) : null;

    if (interruption && state){
        // Handle human approval response
        const confirmation = message.toLowerCase().trim() === 'yes' || message.toLowerCase().trim() === 'y';
        if (confirmation){
            console.log('User approved action:', interruption);
            state.approve(interruption);
        } else {
            console.log('User rejected action:', interruption);
            state.reject(interruption);
        }

        // next interruption if required
        if (interruptions.length){
            const nextInterruption = interruptions.shift();
            requestSession.interruption = nextInterruption;
            return { 
                message: getApprovalMessageForInterruption(nextInterruption), isApproval: true};
        }
    }
    const { interruptions: newInterruptions, state: newState, history, finalOutput } = state ? await sendState(state) : await sendMessage(message, { inputs });

    if (newInterruptions?.length){
        requestSession.state = newState.toString();
        requestSession.interruption = newInterruptions.shift();
        requestSession.interruptions = newInterruptions;
        return { message: getApprovalMessageForInterruption(requestSession.interruption), isApproval: true };
    }
   
    delete requestSession.state;
    delete requestSession.interruptions;
    requestSession.inputs = history;
    return { message: finalOutput, isApproval: false };
}
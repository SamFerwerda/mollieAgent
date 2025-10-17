import { Agent } from '@openai/agents';
import { getAllSubscriptions, getSubscriptionsOfCustomer } from '../tools/subscriptions';

export const subscriptionAgent = new Agent({
  name: 'Subscriptions Agent',
  handoffDescription: 'Handles questions related to subscriptions.',
  instructions: `You assist in retrieving subscription information. If the question is outside of your scope, hand off to the orchestrator.`,
  tools: [
    getAllSubscriptions, getSubscriptionsOfCustomer
  ]
});
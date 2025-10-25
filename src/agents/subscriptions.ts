import { Agent } from '@openai/agents';
import { getAllSubscriptions, getSubscriptionsOfCustomer } from '../tools/subscriptions';

export const subscriptionAgent = new Agent({
  name: 'Subscriptions Agent',
  handoffDescription: 'Handles queries and actions related to subscriptions.',
  instructions: `You assist in retrieving subscription information. If the question is outside of your scope, hand off to the orchestrator. If you provide any styling to your answer, do so using html tags.`,
  tools: [
    getAllSubscriptions, getSubscriptionsOfCustomer
  ]
});
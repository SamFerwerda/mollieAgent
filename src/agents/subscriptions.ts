import { Agent } from '@openai/agents';
import { getAllSubscriptions, getSubscriptionsOfCustomer } from '../tools/subscriptions';

export const subscriptionAgent = new Agent({
  name: 'Subscriptions Agent',
  instructions: 'You assist in providing information about subscriptions',
  tools: [
    getAllSubscriptions, getSubscriptionsOfCustomer
  ]
});
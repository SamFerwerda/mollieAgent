import { Agent } from '@openai/agents';
import { allCustomers, updateCustomerInfo, getCustomerById, removeCustomerById } from '../tools/customerData';

export const customerAgent = new Agent({
  name: 'Customer Agent',
  handoffDescription: 'Handles queries and actions related to customers.',
  instructions: 'You assist users in finding customers and updating their information if required. If you provide any styling to your answer, do so using html tags.',
  tools: [
    allCustomers, updateCustomerInfo, getCustomerById, removeCustomerById
  ]
});
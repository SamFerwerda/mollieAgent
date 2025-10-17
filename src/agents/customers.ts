import { Agent } from '@openai/agents';
import { allCustomers, updateCustomerInfo, getCustomerById, removeCustomerById } from '../tools/customerData';

export const customerAgent = new Agent({
  name: 'Customer Agent',
  handoffDescription: 'Handles questions related to customers.',
  instructions: 'You assist users in finding customers and updating their information if required.',
  tools: [
    allCustomers, updateCustomerInfo, getCustomerById, removeCustomerById
  ]
});
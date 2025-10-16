import { Agent } from '@openai/agents';
import { allCustomers, updateCustomerInfo, getCustomerById, removeCustomerById } from '../tools/customerData';

export const customerAgent = new Agent({
  name: 'Customer Agent',
  instructions: 'You assist users in finding customers and updating their information if required.',
  tools: [
    allCustomers, updateCustomerInfo, getCustomerById, removeCustomerById
  ]
});
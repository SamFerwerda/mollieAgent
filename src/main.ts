import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import axios from 'axios';

const allCustomers = tool({
  name: 'get_all_customers',
  description: 'Retrieve a list of all customers',
  parameters: z.object({}),
  execute: async () => {
    try {
      const response = await axios.get('https://api.mollie.com/v2/customers', {
        headers: {
          Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
        },
      });
    return response.data._embedded.customers.map((customer: any) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        metadata: customer.metadata,
      }));
  } catch (error) {
    return `Error fetching customers: ${JSON.stringify(error)}`;
  }
}});

const listSubscriptionsOfCustomer = tool({
  name: 'get_all_subscriptions_of_customer',
  description: 'Retrieve a list of all subscriptions of a specific customer',
  parameters: z.object({
    id: z.string(),
  }),
  execute: async (params) => {
    try {
      const response = await axios.get(`https://api.mollie.com/v2/customers/${params.id}/subscriptions`, {
        headers: {
          Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
        },
      });
    return response.data._embedded.subscriptions.map((subscription: any) => ({
        id: subscription.id,
        customerId: subscription.customerId,
        description: subscription.description,
        interval: subscription.interval,
        startDate: subscription.startDate,
        amount: subscription.amount,
        status: subscription.status,
        metadata: subscription.metadata,
      }));
  } catch (error) {
    return `Error fetching subscriptions: ${JSON.stringify(error)}`;
  }
}});

const updateCustomerInfo = tool({
  name: 'update_customer_info',
  description: 'Update customer information',
  parameters: z.object({
    id: z.string(),
    email: z.string().email().nullable().optional(),
    name: z.string().min(2).max(100).nullable().optional(),
    metadata: z.record(z.string()).nullable().optional(),
  }),
  execute: async (params) => {
    try {
        const { id, ...updateData } = params;
        await axios.patch(`https://api.mollie.com/v2/customers/${id}`, {
            ...updateData
        }, {
            headers: {
                Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
            },
        });
        return `The customer data has succesfully been updated`;
    } catch (error) {
        return `Error updating customer: ${JSON.stringify(error)}`;
    }
  }
});

const customerAgent = new Agent({
  name: 'Customer Agent',
  instructions: 'You assist users in finding customers and updating their information if required.',
  tools: [
    allCustomers, updateCustomerInfo, listSubscriptionsOfCustomer
  ]
});

const agent = new Agent({
  name: 'Orchestrator',
  instructions: 'You are the orchestrator agent. You can hand off to other agents when necessary.',
  handoffs: [
    customerAgent
  ]
});

const result = await run(
  agent,
  'Can you give me an overview of the subscriptions of the customer with the name Kippetje kip?',
);

console.log(result.finalOutput);
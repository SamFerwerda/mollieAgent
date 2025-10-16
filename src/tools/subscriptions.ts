import { tool } from '@openai/agents';
import { z } from 'zod';
import axios from 'axios';

/**
 * Retrieve all subscriptions
 * @return A list of subscriptions or an error message.
 */
export const getAllSubscriptions = tool({
  name: 'get_all_subscriptions',
  description: 'Retrieve a list of all the subscriptions',
  parameters: z.object({}),
  execute: async () => {
    try {
      const response = await axios.get(`https://api.mollie.com/v2/subscriptions`, {
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

/**
 * Retrieve all subscriptions of a specific customer
 * @param id - The ID of the customer to retrieve subscriptions for.
 * @return A list of subscriptions or an error message.
 */
export const getSubscriptionsOfCustomer = tool({
  name: 'get_subscriptions_of_customer',
  description: 'Retrieve subscriptions of a specific customer by customer ID.',
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
    return `Error fetching subscriptions of customer: ${JSON.stringify(error)}`;
  }
}});
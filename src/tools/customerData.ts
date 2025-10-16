import { tool } from '@openai/agents';
import { z } from 'zod';
import axios from 'axios';

/**
 * Fetch all customers from the Mollie API.
 * @return A list of customers or an error message.
 */
export const allCustomers = tool({
  name: 'get_all_customers',
  description: 'Retrieve a list of all mollie customers and will return a list of customers with their id, name, email and metadata.',
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

/**
 * Get single customer by ID.
 * @param id - The ID of the customer to retrieve.
 * @return The customer data or an error message.
 */
export const getCustomerById = tool({
  name: 'get_customer_by_id',
  description: 'Retrieve a single mollie customer by ID.',
  parameters: z.object({
    id: z.string().min(1).max(100),
  }),
  execute: async ({ id }) => {
    try {
      const response = await axios.get(`https://api.mollie.com/v2/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
        },
      });
    return response.data;
  } catch (error) {
    return `Error fetching customers: ${JSON.stringify(error)}`;
  }
}});

/**
 * Remove single customer by ID.
 * @param id - The ID of the customer to remove.
 * @return A success message or an error message.
 */
export const removeCustomerById = tool({
  name: 'remove_customer_by_id',
  description: 'Remove a single mollie customer by ID. This action is irreversible.',
  parameters: z.object({
    id: z.string().min(1).max(100),
  }),
  execute: async ({ id }) => {
    try {
      const response = await axios.delete(`https://api.mollie.com/v2/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
        },
      });
    return response.data;
  } catch (error) {
    return `Error fetching customers: ${JSON.stringify(error)}`;
  }
}});

/**
 * Update customer information provided by the agent.
 * @param id - The ID of the customer to update.
 * @param email - The new email of the customer (optional).
 * @param name - The new name of the customer (optional).
 * @param metadata - The new metadata for the customer (optional).
 * @returns A success message or an error message.
 */
export const updateCustomerInfo = tool({
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
// resolvers.js
import axios from 'axios';

// The base URL for your existing Spring Boot API
const REST_API_URL = 'http://localhost:8080/api'; 

export const resolvers = {
  Query: {
    // Resolver for the 'listExpenses' query
    listExpenses: async () => {
      try {
        const response = await axios.get(`${REST_API_URL}/expenses`);
        
        // Convert date arrays [2025,1,1] → "2025-01-01"
        return response.data.map(exp => ({
          ...exp,
          date: Array.isArray(exp.date)
            ? `${exp.date[0]}-${String(exp.date[1]).padStart(2, '0')}-${String(exp.date[2]).padStart(2, '0')}`
            : exp.date
        }));
      } catch (error) {
        console.error('Error fetching expenses from REST API:', error.message);
        throw new Error('Failed to fetch expenses.');
      }
    },


    // Resolver for the 'totalExpense' query
    totalExpense: async () => {
      try{
        const response = await axios.get( `${REST_API_URL}/expenses/summary/total`)
        return response.data.total
      }
      catch (error){
        console.error('Error fetching expenses from REST API:', error.message);
        throw new Error('Failed to fetch expenses.');
      }
    },

    
    // Resolver for the 'expensesByCategory' query
    expensesByCategory: async () => {
      try {
        const response = await axios.get(`${REST_API_URL}/expenses/summary/by-category`);
        const data = response.data;

        // Convert object → array
        const result = Object.entries(data).map(([category, total]) => ({
          category,
          total,
        }));

        return result;
      } catch (error) {
        console.error('Error fetching expenses by category:', error.message);
        throw new Error('Failed to fetch expenses by category.');
      }
    },

    // Resolver for the 'expensesByMonth' query
    expensesByMonth: async () => {
      try {
        const response = await axios.get(`${REST_API_URL}/expenses/summary/monthly`);
        const data = response.data;

        // Convert object → array
        const result = Object.entries(data).map(([month, total]) => ({
          month,
          total,
        }));

        return result;
      } catch (error) {
        console.error('Error fetching monthly expense summary:', error.message);
        throw new Error('Failed to fetch monthly expense summary.');
      }
    },


  },
  

  Mutation: {
    // Resolver for the 'addExpense' mutation (a POST request to the REST API)
    addExpense: async (_, args) => {
      try {
        const newExpense = {
          title: args.title,
          amount: args.amount,
          category: args.category,
          date: args.date
        };

        const response = await axios.post(`${REST_API_URL}/expenses`, newExpense);
        const expense = response.data;

        // ✅ Convert LocalDate array [YYYY, M, D] → "YYYY-MM-DD"
        if (Array.isArray(expense.date)) {
          const [y, m, d] = expense.date;
          expense.date = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        }

        return expense;
      } catch (error) {
        console.error('Error adding expense:', error.message);
        throw new Error('Failed to add expense.');
      }
    },

    
    // Resolver for the 'deleteExpense' mutation
    deleteExpense: async (_, { id }) => {
      try {
        const response = await axios.delete(`${REST_API_URL}/expenses/${id}`);
        return true;
      } catch (error) {
        console.error('Error deleting expense:', error.message);
        throw new Error('Failed to delete expense.');
      }
    },

    updateExpense: async (parent, args) => {
      try {
        // Extract args
        const { id, title, amount, category, date } = args;

        // Prepare body (only include fields provided)
        const updatedExpense = {};
        if (title !== undefined) updatedExpense.title = title;
        if (amount !== undefined) updatedExpense.amount = amount;
        if (category !== undefined) updatedExpense.category = category;
        if (date !== undefined) updatedExpense.date = date;

        // Send PUT request to your REST API
        const response = await axios.put(`${REST_API_URL}/expenses/${id}`, updatedExpense);
        const expense = response.data;

        // Convert LocalDate array [YYYY, M, D] → "YYYY-MM-DD"
        if (Array.isArray(expense.date)) {
          const [y, m, d] = expense.date;
          expense.date = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        }

        return expense;
      } catch (error) {
        console.error('Error updating expense:', error.message);
        throw new Error('Failed to update expense.');
      }
    }


  }
};
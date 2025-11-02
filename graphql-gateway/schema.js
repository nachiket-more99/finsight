import { gql } from 'graphql-tag';

export const typeDefs = gql`
  # Expense data type
  type Expense {
    id: ID!
    title: String!
    amount: Float!
    category: String!
    date: String!
  }

  # Category summary (for by-category endpoint)
  type CategorySummary {
    category: String!
    total: Float!
  }

  # Monthly summary (for /summary/monthly endpoint)
  type MonthlySummary {
    month: String!
    total: Float!
  }

  type Query {
    # All expenses
    listExpenses: [Expense!]!

    # Total expenses
    totalExpense: Float!

    # Expenses grouped by category
    expensesByCategory: [CategorySummary!]!

    # Expense grouped by Month
    expensesByMonth: [MonthlySummary!]!
  }

  type Mutation {
    addExpense(
      title: String!
      amount: Float!
      category: String!
      date: String!
    ): Expense!

    updateExpense(
      id: ID!
      title: String
      amount: Float
      category: String
      date: String
    ): Expense!

    deleteExpense(id: ID!): Boolean!
  }
`;

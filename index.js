// server.js

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const resolvers = require('./resolvers');

const app = express();

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    hello: String
    users: [User]
    # Other query definitions...
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    # Other mutation definitions...
  }
`;

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer().then(() => {
  app.listen(4000, () => {
    console.log('Server listening on http://localhost:4000/graphql');
  });
}).catch(err => {
  console.error('Error starting Apollo Server:', err);
});

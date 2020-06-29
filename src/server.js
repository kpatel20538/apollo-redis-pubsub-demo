const { ApolloServer } = require("apollo-server");

const typeDefs = require('./schema');
const resolvers = require("./resolvers");

const server = new ApolloServer({ typeDefs, resolvers });

const hostname = "0.0.0.0";
const port = 3000;
server.listen(port, hostname).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});

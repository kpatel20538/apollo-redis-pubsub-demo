const { ApolloServer, gql } = require("apollo-server");
const { RedisPubSub } = require("graphql-redis-subscriptions");
const Redis = require("ioredis");

class PostController {
  constructor() {
    this.data = [];
  }
  addPost(post)  {
    this.data.push(post);
    return post;
  };
  posts() {
    return this.data;
  }
}

const postController = new PostController();

const typeDefs = gql`
  type Subscription {
    postAdded: Post
  }
  type Query {
    posts: [Post]
  }

  type Mutation {
    addPost(author: String, comment: String): Post
  }

  type Post {
    author: String
    comment: String
  }
`;

const options = {
  host: process.env.REDIS_SERVICE_HOST,
  port: process.env.REDIS_SERVICE_PORT,
  retryStrategy: (times) => Math.min(times * 50, 2000),
};

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

const POST_ADDED = "POST_ADDED";

const resolvers = {
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator([POST_ADDED]),
    },
  },
  Query: {
    posts(root, args, context) {
      return postController.posts();
    },
  },
  Mutation: {
    addPost(root, args, context) {
      pubsub.publish(POST_ADDED, { postAdded: args });
      return postController.addPost(args);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const hostname = "0.0.0.0";
const port = 3000;
server.listen(port, hostname).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});

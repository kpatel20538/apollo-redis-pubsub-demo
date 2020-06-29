const { RedisPubSub } = require("graphql-redis-subscriptions");
const Redis = require("ioredis");
const postController = require("./store");

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

module.exports = {
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

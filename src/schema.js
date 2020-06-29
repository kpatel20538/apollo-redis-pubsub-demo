const { gql } = require('apollo-server');

module.exports = gql`
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

const data = [];

const addPost = (post) => {
  data.push(post);
  return post;
};

const posts = () => {
  return data;
}

module.exports = {
  addPost,
  posts,
};
import PropTypes from 'prop-types';
import Post from "./Post"

function Feed({ posts }) {
  return (
    <div className="feed">
      {posts.map((post) => (
        <Post key={post.postid} {...post} />
      ))}
    </div>
  )
}

Feed.propTypes = {
  posts: PropTypes.array.isRequired
};

export default Feed
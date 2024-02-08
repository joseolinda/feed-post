import PropTypes from 'prop-types';
import Post from "./Post"

import { useState } from 'react'

function Feed({ posts }) {
  const [filteredPosts, setFilteredPosts] = useState(posts)
  function removePost(postid) {
    setFilteredPosts(filteredPosts.filter(post => post.postid !== postid))
  }

  return (
    <div className="feed">
      {filteredPosts.map((post) => (
        <Post key={post.postid} {...post} onDelete={removePost} />
      ))}
    </div>
  )
}

Feed.propTypes = {
  posts: PropTypes.array.isRequired
};

export default Feed
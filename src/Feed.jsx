import Post from "./Post"

function Feed({ posts }) {
  return (
    <div className="feed">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  )
}

export default Feed
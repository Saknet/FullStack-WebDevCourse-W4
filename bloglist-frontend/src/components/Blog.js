import React from 'react'

const Blog = ({ blog, showBlog}) => (
  <div onClick = {showBlog}>
    {blog.title} {blog.author}
  </div>  
)

export default Blog
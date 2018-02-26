import React from 'react'
import { BrowserRouter as Router, Route, Link, NavLink, Redirect } from 'react-router-dom'

const SingleBlog = ({ blog }) => {
    return (
        <div>
            <Link to = {`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
        </div>
    )
  }

const checkForDelete = (blog, currentUser) => {
    if (blog.user === undefined || blog.user.username === currentUser.username) {
      return true;
    } 
  
    return false;
}

const deleteButton = (blogDelete, blog) => (
    <div>
      <button onClick = {blogDelete(blog)}>delete blog</button>
    </div>   
  )

const Blogview = ({ blog, blogUpdate, blogDelete, currentUser }) => {
    let usersname = 'unkown user'
    if (blog.user !== undefined) {
      usersname = blog.user.name
    }
    console.log(blog)
    return (
      <div>
        <div>
          <h1>{blog.title} {blog.author} </h1>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          {blog.likes} likes <button onClick = {blogUpdate(blog)}>like</button>
        </div>
        <div>
          added by {usersname}
        </div>
        {checkForDelete(blog, currentUser) ?
        deleteButton(blogDelete, blog) : 
        ""
        }
      </div>
)}  
  
export default { SingleBlog, Blogview}
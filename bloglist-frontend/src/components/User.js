import React from 'react'
import { BrowserRouter as Router, Route, Link, NavLink, Redirect } from 'react-router-dom'

const Userview = ({ user }) => {
    return (
      <div>
          <h1>{user.name}</h1>
          <h2>Added blogs</h2>

          {user.blogs.map(blog => <Blog key = {blog._id} blog = {blog} />)}

      </div>
)}

const Blog = ({ blog }) => {
    return (
        <div className = "ui bulleted list">
            <div className = "item">{blog.title} by {blog.author}</div>
        </div>
    )
}

const Username = ({ user }) => {
    return (
      <div>
        <Link to = {`/users/${user.id}`}>{user.username}</Link>
      </div>
  )}
  
  const UsersBlogs = ({ blogs }) => {
    return (
      <div>
        {blogs}
      </div>
  )}

  export default { Userview, Username, UsersBlogs }

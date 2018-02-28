import React from 'react'
import { BrowserRouter as Router, Route, Link, NavLink, Redirect } from 'react-router-dom'
// @flow

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

class User extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: this.props.user
        }
    }
 
  
    render() {
        return (
            <div>
                <h1>{this.state.user.name}</h1>
                <h2>Added blogs</h2>

                {this.state.user.blogs.map(blog => <Blog key = {blog._id} blog = {blog} />)}
            </div>
        )  
    }
}

export default { User, Username, UsersBlogs }

import React from 'react'
import Blog from '../components/Blog2'
import blogService from '../services/blogs'
import loginService from '../services/login'
import LoginForm from '../components/LoginForm'
import BlogForm from '../components/BlogForm'
import Togglable from '../components/Togglable'
import '../index.css'
import { BrowserRouter as Router, Route, Link, NavLink, Redirect } from 'react-router-dom'

class Blogs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      error: null,
      success: null,
      newAuthor: '',
      newTitle: '',
      newUrl: '',
      likes: '',
      username: '',
      password: '',
      user: null
    }
  }

  componentWillMount() {
    blogService
      .getAll()
      .then(blogs => {
        this.setState({ blogs })
      })

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
      blogService.setToken(user.token)
    }    
  }

  addBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog  = await blogService.create({
        author: this.state.newAuthor,
        title: this.state.newTitle,
        url: this.state.newUrl,
        user: this.state.user
      })
      this.setState({
        blogs: this.state.blogs.concat(newBlog),
        newAuthor: '',
        newTitle: '',
        newUrl: '',
        success: `a new blog '${newBlog.title}' by '${newBlog.author}' added`
      })
      setTimeout(() => {
        this.setState({ success: null })
      }, 5000)
    } catch (exception) {
      this.setState({
        error: 'something went wrong',
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      this.setState({ username: '', password: '', success: `${user.username} succesfully logged in`, user })
      setTimeout(() => {
        this.setState({ success: null })
      }, 5000)
    } catch (exception) {
      this.setState({
        error: 'wrong username or password',
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  logout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      this.setState({ username: '', password: '', user: null, success: 'logout was succesful' })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    } catch (exception) {
      this.setState({
        error: 'something went wrong',
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }


  handleLoginFieldChange = (event) => {
    if (event.target.name === 'password') {
      this.setState({ password: event.target.value })
    } else if (event.target.name === 'username') {
      this.setState({ username: event.target.value })
    }
  }

  handleNewBlogFieldChange = (event) => {
    if (event.target.name === 'title') {
      this.setState({ newTitle: event.target.value })
    } else if (event.target.name === 'author') {
      this.setState({ newAuthor: event.target.value })
    } else if (event.target.name === 'url') {
      this.setState({ newUrl: event.target.value })
    }
  }

  updateBlog = (blog) => {
    return () => {
      blogService
      .update(blog.id, { 
        author: blog.author,
        title: blog.title,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user
      })
      .then(updatedBlog => {
        this.setState({ 
          blogs: this.state.blogs.map(b => b.id !== blog.id ? b : updatedBlog ),
          success: `${blog.title} succesfully liked`
        })
        setTimeout(() => {
          this.setState({ success: null })
        }, 5000)
      })
      .catch(error => {
        this.setState({
          error: 'something went wrong',
        })
        setTimeout(() => {
          this.setState({ error: null })
        }, 5000)
      })
    } 
  }

  removeBlog = (blog) => {
    return () => {
        const c = window.confirm("delete " + blog.title + " by " + blog.author)
        if (c) {
            blogService
            .remove(blog.id)
            .then(
                this.setState({ 
                    blogs: this.state.blogs.filter(b => b.id !== blog.id),
                    success: `Blog '${blog.title}' by ' ${blog.author} was successfully deleted`
                }))
            window.location.reload()  //jotta delete toimisi 7.4 jälkeen
            setTimeout(() => {
                this.setState({success: null})
            }, 5000)
        }
    }
}

  blogById = (id) =>
    this.state.blogs.find(b => b.id === id)
  
  render() {
    const allBlogs = () => (
      this.state.blogs.sort((a, b) => b.likes - a.likes).map(blog => <Blog.SingleBlog key = {blog.id} blog = {blog}/>)
    )

    const blogForm = () => (
      <Togglable buttonLabel = "create new blog">
        <BlogForm
          visible = {this.state.visible}
          title = {this.state.newTitle}
          author = {this.state.newAuthor}
          url = {this.state.newUrl}
          handleChange = {this.handleNewBlogFieldChange}
          handleSubmit = {this.addBlog}
        />
      </Togglable>
    )

    const loginForm = () => (
        <Togglable buttonLabel = "login">
          <LoginForm
            visible = {this.state.visible}
            username = {this.state.username}
            password = {this.state.password}
            handleChange = {this.handleLoginFieldChange}
            handleSubmit = {this.login}
          />
        </Togglable>
      )
  
    return (
      <div>
        <h2>blog app</h2>

        {this.state.user === null ?
          loginForm() :
          <Router>
          <div>
            {blogForm()}
            {allBlogs()} 
            <Route exact path = "/blogs/:id"  render = {({match}) => 
            <Blog.Blog2
              key = {match.params.id} 
              blog = {this.blogById(match.params.id)} 
              blogUpdate = {this.updateBlog} 
              blogDelete = {this.removeBlog} 
              currentUser = {this.state.user}
              blogs = {this.state.blogs} />} />
 
          </div>
          </Router>
        }  

      </div>
    )
  }
}

export default Blogs;

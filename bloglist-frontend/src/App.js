import React from 'react'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { BrowserRouter as Router, Route, Link, NavLink, Redirect } from 'react-router-dom'
import Users from './views/Users'
import Blogs from './views/Blogs'
import './index.css'

const Menu = ({ user, login, logout }) => (
  <div>
    <Link to = "/blogs">blogs</Link>&nbsp;
    <Link to = "/users">users</Link>&nbsp;
    {user === null ?
          'Please use the form below to login'  :
          <div>
            {user.name} logged in <button onClick= {logout}>logout</button>
          </div>
    }
  </div>
)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      error: null,
      success: null,
      username: '',
      password: '',
      newAuthor: '',
      newTitle: '',
      newUrl: '',
      likes: '',
      user: null,
      users: []
    }
  }

  componentWillMount() {
    blogService
      .getAll()
      .then(blogs => {
        this.setState({ blogs })
      })

      userService
      .getAll()
      .then(users => {
        this.setState({ users })
    })

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
      blogService.setToken(user.token)
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

  handleNewBlogFieldChange = (event) => {
    if (event.target.name === 'title') {
      this.setState({ newTitle: event.target.value })
    } else if (event.target.name === 'author') {
      this.setState({ newAuthor: event.target.value })
    } else if (event.target.name === 'url') {
      this.setState({ newUrl: event.target.value })
    }
  }

  handleLoginFieldChange = (event) => {
    if (event.target.name === 'password') {
      this.setState({ password: event.target.value })
    } else if (event.target.name === 'username') {
      this.setState({ username: event.target.value })
    }
  }
  
  render() {  

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

        <h1>blog app</h1>
        
        <Router>
          <div>
            <Notification error = {this.state.error} success = {this.state.success}/>
            <Menu user = {this.state.user} logout = {this.logout} />
            {this.state.user === null ?
              loginForm() :
              blogForm()
            }   
        
            <Route exact path = "/blogs" render = {() => <Blogs /> }  />
            <Route exact path = "/users" render = {() => <Users /> }  />
          </div>
        </Router>  
        
      </div>
    )
  }
}

export default App;

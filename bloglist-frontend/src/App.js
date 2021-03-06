import React from 'react'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog2 from './components/Blog2'
import User from './components/User'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Users from './views/Users'
import Blogs from './views/Blogs'
import './index.css'
import { Container, Button, Menu, Message } from 'semantic-ui-react'
// @flow

const NavBar = ({ user, login, logout }) => (
  <Menu inverted>
    <Menu.Item link> 
      <Link to = "/blogs">blogs</Link>&nbsp;
    </Menu.Item>
    <Menu.Item link> 
      <Link to = "/users">users</Link>&nbsp;
    </Menu.Item>
    <Menu.Item link>
    {user === null ?
          'Please use the form below to login'  :
          <div>
            {user.name} logged in <Button onClick= {logout}>logout</Button>
          </div>
    }
    </Menu.Item>
  </Menu>
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

  blogById = (id) =>
    this.state.blogs.find(b => b.id === id)

  userById = (id) =>
    this.state.users.find(a => a.id === id)
  
  render() {  
    if (this.state.blogs.length === 0 || this.state.users.length === 0) {
      return null
    }

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
      <Container>

        <h1>blog app</h1>
        
        <Router>
          <div>
            {(this.state.success &&
              <Message success>
                {this.state.success}
              </Message>
            )}
            {(this.state.error &&
              <Message warning>
                {this.state.error}
              </Message>
            )}

            <Notification error = {this.state.error} success = {this.state.success}/>
            <NavBar user = {this.state.user} logout = {this.logout} />
            {this.state.user === null ?
              loginForm() :
              blogForm()
            }   
        
            <Route exact path = "/blogs" render = {() => <Blogs /> }  />
            <Route exact path = "/users" render = {() => <Users /> }  />
            <Route exact path = "/users/:id" render = {({match}) => <User.User key = {match.params.id} user = {this.userById(match.params.id)} />} />
            <Route exact path = "/blogs/:id" render = {({match}) =>             
            <Blog2
              key = {match.params.id} 
              blog = {this.blogById(match.params.id)}  
              currentUser = {this.state.user}
              blogs = {this.state.blogs} />} />
          </div>
        </Router>  
        
      </Container>
    )
  }
}

export default App;

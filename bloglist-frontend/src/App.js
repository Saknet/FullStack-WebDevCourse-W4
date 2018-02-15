import React from 'react'
import Blog from './components/Blog'
import ShowBlog from './components/ShowBlog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import './index.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      error: null,
      success: null,
      newAuthor: '',
      newTitle: '',
      newUrl: '',
      username: '',
      password: '',
      user: null,
      currentBlog: null
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
  
  setCurrentBlog = (blog) => () => {
    if (Object.keys(blog).length === 5) {
      blog['user'] = null
    }

    this.setState({ currentBlog: blog })
  }

  render() {
    
    const allBlogs = () => (
      this.state.blogs.map(blog =><Blog key = {blog._id} blog = {blog} showBlog = {this.setCurrentBlog(blog)}/>)
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
    const blogForm = () => (
      <div>
        <h2>Luo uusi blogi</h2>
        <form onSubmit = {this.addBlog}>
        <div>
          title
          <input
            type = "text"
            name = "title"
            value = {this.state.newTitle}
            onChange = {this.handleNewBlogFieldChange}
          />
        </div>
        <div>
          author
          <input
            type = "text"
            name = "author"
            value = {this.state.newAuthor}
            onChange = {this.handleNewBlogFieldChange}
          />
        </div>
        <div>
          url
          <input            
            type = "text"
            name = "url"
            value = {this.state.newUrl}
            onChange = {this.handleNewBlogFieldChange}
          />
        </div>
          <button type = "submit">create</button>
        </form>
      </div>
    )
  
    return (
      <div>
        <h2>blogs</h2>

        <Notification error = {this.state.error} success = {this.state.success}/>

        {this.state.user === null ?
          loginForm() :
          <div>
            <p>{this.state.user.name} logged in</p>
            <button onClick = {this.logout}> logout</button>
            {blogForm()}
          </div>
        }
        {this.state.currentBlog === null ?
          allBlogs() :
          <div>
          <ShowBlog blogToShow = {this.state.currentBlog}> 
            {allBlogs()}
          </ShowBlog>
        </div>           
        }
      </div>
    )
  }
}

export default App;

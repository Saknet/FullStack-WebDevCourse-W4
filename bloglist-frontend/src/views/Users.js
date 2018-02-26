import React from 'react'
import User from '../components/User'
import userService from '../services/users'
import { BrowserRouter as Router, Route, Link, NavLink, Redirect } from 'react-router-dom'

class Users extends React.Component {
  constructor() {
    super()
    this.state = {
      users: []
    }
  }

  componentWillMount() {
    userService
      .getAll()
      .then(users => {
        this.setState({ users })
    })
  }

  userById = (id) =>
    this.state.users.find(u => u.id === id)

  render() {
    return(
      <div>
        <h2>Users</h2>
        
        <Router>
        <div>
          <Route exact path = "/users/:id" render = {({match}) => <User.Userview key = {match.params.id} user = {this.userById(match.params.id)} />} />

          <p>Näkymään päästään klikkaamalla nimeä kaikkien käyttäjien näkymästä</p>
          
          <table>
            <tbody>
              <tr>
                <th></th> 
                <th>blogs added</th>
              </tr>
              <tr>
                <td>{this.state.users.map(user => <User.Username key = {user.id} user = {user} />)} </td>
                <td>{this.state.users.map(user => <User.UsersBlogs key = {user.id} blogs = {user.blogs.length} />)} </td>
              </tr>
            </tbody>
          </table>
        </div>

        </Router>

      </div>  
    )

  }
}

export default Users;


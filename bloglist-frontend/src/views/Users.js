import React from 'react'
import User from '../components/User'
import userService from '../services/users'
import { BrowserRouter as Router, Route, Link, NavLink, Redirect } from 'react-router-dom'
import { Container, Table } from 'semantic-ui-react'

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
    this.state.users.find(a => a.id === id)

  render() {
    return(
      <Container>
        <h2>Users</h2>
        
        <Router>
        <div>
          <Route exact path = "/users/:id" render = {({match}) => <User.Userview key = {match.params.id} user = {this.userById(match.params.id)} />} />

          <p>Näkymään päästään klikkaamalla nimeä kaikkien käyttäjien näkymästä</p>
          
          <Table striped celled>
            <Table.Body>
              <Table.Row>
                <th></th> 
                <th>blogs added</th>
              </Table.Row>
              <Table.Row>
                <Table.Cell>{this.state.users.map(user => <User.Username key = {user.id} user = {user} />)} </Table.Cell>
                <Table.Cell>{this.state.users.map(user => <User.UsersBlogs key = {user.id} blogs = {user.blogs.length} />)} </Table.Cell>
              </Table.Row>
              </Table.Body>
          </Table>
        </div>

        </Router>

      </Container>  
    )

  }
}

export default Users;


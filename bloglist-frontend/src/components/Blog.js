import React from 'react'

class Blog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

toggleVisibility = () => {
  this.setState({ visible: !this.state.visible })
}

checkForDelete = () => {
  if (this.props.blog.user === undefined || this.props.blog.user.username === this.props.currentUser.username) {
    return true;
  } 

  return false;
}

render() {
  const hideWhenVisible = { display: this.state.visible ? 'none' : '' }
  const showWhenVisible = { display: this.state.visible ? '' : 'none' }
  let usersname = 'unkown user'
  if (this.props.blog.user !== undefined) {
    usersname = this.props.blog.user.username
  } 

  const Blog = () => (
    <div className = "info">
      {this.props.blog.title} {this.props.blog.author}
    </div>  
  )

  const deleteButton = () => (
    <div>
      <button onClick = {this.props.blogDelete(this.props.blog)}>delete</button>
    </div>   
  )

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className = "blog" style = {blogStyle}>
      <div style = {hideWhenVisible} onClick = {this.toggleVisibility}>
      {Blog()}
      </div>
      <div style = {showWhenVisible} onClick = {this.toggleVisibility}>
        <div>
          {this.props.blog.title} {this.props.blog.author}
        </div>
        <div className = "url">
          {this.props.blog.url}
        </div>
        <div className = "likes">
          {this.props.blog.likes} likes <button onClick = {this.props.blogUpdate(this.props.blog)}>like</button>
        </div>
        <div className = "user">
          added by {usersname}
        </div>
        {this.checkForDelete() ?
        deleteButton() : 
        ""
        }
      </div>
    </div>
  )
}
}

export default Blog
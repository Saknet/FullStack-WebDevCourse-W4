import React from 'react'

class ShowBlog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const hideWhenVisible = { display: this.state.visible ? 'none' : '' }
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }
    let usersname = ''
    if (this.props.blogToShow.user === null) {
      usersname = 'unknown'
    } else {
      usersname = this.props.blogToShow.user.name
    }

    console.log(usersname)

    return (
      <div>
        <div style={hideWhenVisible} onClick = {this.toggleVisibility}>
          {this.props.children}
        </div>
        <div style={showWhenVisible} onClick = {this.toggleVisibility}>
        {this.props.children}
          <div>
            {this.props.blogToShow.title} {this.props.blogToShow.author}
          </div>
          <div>
            {this.props.blogToShow.url}
          </div>
          <div>
            {this.props.blogToShow.likes} <button>like</button>
          </div>
          <div>
            added by {usersname}
          </div>
        </div>
      </div>
    )
  }
}

export default ShowBlog
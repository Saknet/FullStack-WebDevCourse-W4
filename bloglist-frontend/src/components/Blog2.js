import React from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import CommentForm from './CommentForm'
import blogService from '../services/blogs'
import Notification from './Notification'
import { Container, Button, Message } from 'semantic-ui-react'

const SingleBlog = ({ blog }) => {
    return (
        <div>
            <Link to = {`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
        </div>
    )
  }
  
  const Comment = ({ content }) => {
    return (
        <div className = "ui bulleted list">
            <div className = "item">{content}</div>
        </div>
  )}

  class Blog2 extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        newContent: '',
        blog: this.props.blog,
        success: null,
        error: null
      }
    }
  
    addComment = async (event) => {
      event.preventDefault()
      try {
        const newComment  = await blogService.addComment({
          id: this.props.blog.id,
          content: this.state.newContent
        })
        const updatedBlog = await blogService.get(this.state.blog.id)

        this.setState({
          blog: updatedBlog,
          success: `comment '${this.state.newContent}' added to a blog '${updatedBlog.title}'`,
          newContent: ''
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
  
    handleNewCommentFieldChange = (event) => {
      this.setState({ newContent: event.target.value })
    }

    checkForDelete = () => {
      if (this.state.blog.user === undefined || this.state.blog.user.username === this.props.currentUser.username) {
        return true;
      } 
    
      return false;
    }

    updateBlog = () => {
      return () => {
        blogService
        .update(this.state.blog.id, { 
          author: this.state.blog.author,
          title: this.state.blog.title,
          url: this.state.blog.url,
          likes: this.state.blog.likes + 1,
          user: this.state.blog.user,
          blogcomments: this.state.blog.blogcomments
        })
        .then(updatedBlog => {
          this.setState({ 
            success: `Blog '${this.state.blog.title}' succesfully liked`,
            blog: updatedBlog
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
  
    removeBlog = () => {
      return () => {
          const c = window.confirm("delete " + this.state.blog.title + " by " + this.state.blog.author)
          if (c) {
              blogService
              .remove(this.state.blog.id)
              .then(
                  this.setState({ 
                    success: `Blog '${this.state.blog.title}' by ' ${this.state.blog.author} was successfully deleted`,
                    blog: this.props.blogs[0]  //workaround että delete pelais 7.4 jälkeen
                  }))

              setTimeout(() => {
                  this.setState({success: null})
              }, 5000)
          }
      }
  }
  
    
    render() {
      const deleteButton = () => (
        <div>
          <Button onClick = {this.removeBlog(this.state.blog)}>delete</Button>
        </div>   
      )

      let usersname = 'unknown user'
      if (this.state.blog.user !== undefined) {
        usersname = this.state.blog.user.name
      }
      return (
        <Container>
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
          <div>
            <h1>{this.state.blog.title} {this.state.blog.author} </h1>
          </div>
          <div>
            {this.state.blog.url}
          </div>
          <div>
            {this.state.blog.likes} likes <Button onClick = {this.updateBlog()}>like</Button>
          </div>
          <div>
            added by {usersname}
          </div>
          {this.checkForDelete() ?
          deleteButton() : 
          ""
          }
          <h2>comments</h2>
          <div>
            {this.state.blog.blogcomments.map(comment => <Comment key = {comment._id} content = {comment.content} />)}
          </div>
  
        <CommentForm
          content = {this.state.newContent}
          handleChange = {this.handleNewCommentFieldChange}
          handleSubmit = {this.addComment}
        />
        </Container>
      )  
    }
  }  
  
export default { SingleBlog, Blog2}
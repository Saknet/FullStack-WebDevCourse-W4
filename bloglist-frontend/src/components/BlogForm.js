import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'semantic-ui-react'

const BlogForm = ({ handleSubmit, handleChange, title, author, url }) => {
  return (
    <div>
    <h2>Luo uusi blogi</h2>
    <Form onSubmit = {handleSubmit}>
    <Form.Field>
      title
      <input
        type = "text"
        name = "title"
        value = {title}
        onChange = {handleChange}
      />
    </Form.Field>
    <Form.Field>
      author
      <input
        type = "text"
        name = "author"
        value = {author}
        onChange = {handleChange}
      />
    </Form.Field>
    <Form.Field>
      url
      <input            
        type = "text"
        name = "url"
        value = {url}
        onChange = {handleChange}
      />
    </Form.Field>
      <Button type = "submit">create</Button>
    </Form>
  </div>
  )
}

BlogForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }

export default BlogForm
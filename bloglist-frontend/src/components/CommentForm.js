import React from 'react'
import PropTypes from 'prop-types'

const CommentForm = ({ handleSubmit, handleChange, content }) => {
    return (
      <div>
      <form onSubmit = {handleSubmit}>
      <div>
        <input
          type = "text"
          name = "content"
          value = {content}
          onChange = {handleChange}
        />
        <button type = "submit">add comment</button>
      </div>    
      </form>
    </div>
    )
  }

  CommentForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    content: PropTypes.string.isRequired
  }

export default CommentForm
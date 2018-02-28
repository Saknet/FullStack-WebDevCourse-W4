import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'semantic-ui-react'
// @flow

const CommentForm = ({ handleSubmit, handleChange, content }) => {
    return (
        <div>
            <Form onSubmit = {handleSubmit}>
                <Form.Field>
                    <input
                        type = "text"
                        name = "content"
                        value = {content}
                        onChange = {handleChange}
                    />
                    <Button type = "submit">add comment</Button>
                </Form.Field>    
            </Form>
        </div>
    )
}

CommentForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    content: PropTypes.string.isRequired
}

export default CommentForm
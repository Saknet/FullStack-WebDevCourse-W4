import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'semantic-ui-react'
// @flow

const LoginForm = ({ handleSubmit, handleChange, username, password }) => {
    return (
        <div>
            <h2>Kirjaudu</h2>

            <Form onSubmit = {handleSubmit}>
                <Form.Field>
                    käyttäjätunnus
                    <input
                        value = {username}
                        onChange = {handleChange}
                        name = "username"
                    />
                </Form.Field>
                <Form.Field>
                    salasana
                    <input
                        type = "password"
                        name = "password"
                        value = {password}
                        onChange = {handleChange}
                    />
                </Form.Field>
                <Button type = "submit">kirjaudu</Button>
            </Form>
        </div>
    )
}

LoginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
}

export default LoginForm
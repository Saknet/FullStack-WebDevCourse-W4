import React from 'react'

const Notification = ({ error, success }) => {
  if (error === null && success === null) {
    return null
  }

  if (error) {
    return (
        <div className = "error">
          {error}
        </div>
        )
    }
  if (success) {
    return (
         <div className = "success">
            {success}
        </div>
        )
    }
}

export default Notification
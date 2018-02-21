import React from 'react';
import actionFor from './actionCreators'

class App extends React.Component {

  voteAnecdote = (id) => () => {
    this.props.store.dispatch(
      actionFor.voteAnecdote(id)
    )
  }

  addAnecdote = (event) => {
    event.preventDefault()
    this.props.store.dispatch(
      actionFor.anecdoteCreation(event.target.anecdote.value)
    )
    event.target.anecdote.value = ''
  }

  render() {
    const anecdotes = this.props.store.getState()
    return (
      <div>
        <h2>Anecdotes</h2>
        {anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
          <div key = {anecdote.id}>
            <div>
              {anecdote.content} 
            </div>
            <div>
              has {anecdote.votes}
              <button onClick = {this.voteAnecdote(anecdote.id)}>vote</button>
            </div>
          </div>
        )}
        <h2>create new</h2>
        <form onSubmit = {this.addAnecdote}>
          <input name = "anecdote" />
          <button>create</button>
        </form>
      </div>
    )
  }
}

export default App
const generateId = () => Number((Math.random() * 100000).toFixed(0))

export default {
    anecdoteCreation(content) {
        return {
          type: 'NEW_ANECDOTE',
          data: {
            content,
            id: generateId(),
            votes: 0
          }
        }
      },
    voteAnecdote(id) {
      return {
        type: 'VOTE',
        data: { id }
      }
    }
  }
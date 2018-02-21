import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import counterReducer from './reducer'

const store = createStore(counterReducer)

const Statistiikka = () => {
  const palautteita = store.getState()
  let average = 0;
  let positive = 0;
  if (palautteita.good !== 0 || palautteita.ok !== 0 || palautteita.bad !== 0) {
      average = (palautteita.good * 1 + palautteita.bad * - 1) / (palautteita.good + palautteita.ok + palautteita.bad)
      positive = 100 * (palautteita.good / (palautteita.good + palautteita.ok + palautteita.bad))
  } 
  
  if (palautteita === 0) {
    return (
      <div>
        <h2>stataistiikka</h2>
        <div>ei yhtään palautetta annettu</div>
      </div>
    )
  }

  return (
    <div>
      <h2>statistiikka</h2>
      <table>
        <tbody>
          <tr>
            <td>hyvä</td>
            <td>{palautteita.good}</td>
          </tr>
          <tr>
            <td>neutraali</td>
            <td>{palautteita.ok}</td>
          </tr>
          <tr>
            <td>huono</td>
            <td>{palautteita.bad}</td>
          </tr>
          <tr>
            <td>keskiarvo</td>
            <td>{average}</td>
          </tr>
          <tr>
            <td>positiivisia</td>
            <td>{positive} %</td>
          </tr>
        </tbody>
      </table>

      <button onClick = {e => store.dispatch({ type: 'ZERO'})}>nollaa tilasto</button>
    </div >
  )
}

class App extends React.Component {

  klik = (nappi) => () => {
      store.dispatch({ type: nappi})
  }

  render() {
    return (
      <div>
        <h2>anna palautetta</h2>
        <button onClick={this.klik('GOOD')}>hyvä</button>
        <button onClick={this.klik('OK')}>neutraali</button>
        <button onClick={this.klik('BAD')}>huono</button>
        <Statistiikka />
      </div>
    )
  }
}

const render = () => {
    ReactDOM.render(<App />, document.getElementById('root'));
}

render()
store.subscribe(render)

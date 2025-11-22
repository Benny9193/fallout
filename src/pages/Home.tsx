import { useCounterStore } from '../store/counterStore'
import './Home.css'

function Home() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div className="page">
      <h1>Welcome to Fallout Web App</h1>
      <p>This is the home page featuring a counter with global state management.</p>

      <div className="counter-card">
        <h2>Counter: {count}</h2>
        <div className="button-group">
          <button onClick={decrement}>-</button>
          <button onClick={reset}>Reset</button>
          <button onClick={increment}>+</button>
        </div>
        <p className="hint">This counter uses Zustand for state management</p>
      </div>
    </div>
  )
}

export default Home

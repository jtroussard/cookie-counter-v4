import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [serverMessage, setServerMessage] = useState<string>('Loading...')

  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then(res => res.json())
      .then(data => setServerMessage(data.message))
      .catch(err => setServerMessage('Error connecting to server: ' + err.message))
  }, [])

  return (
    <div className="container mt-5">
      <div className="card text-center">
        <div className="card-header">
          Cookie Counter v4
        </div>
        <div className="card-body">
          <h5 className="card-title">Hello World!</h5>
          <p className="card-text">
            Front-end: React + Vite + Bootstrap<br />
            Back-end: {serverMessage}
          </p>
          <a href="#" className="btn btn-primary">Go somewhere</a>
        </div>
        <div className="card-footer text-muted">
          Scaffolded Successfully
        </div>
      </div>
    </div>
  )
}

export default App

import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Workspaces from './components/Workspaces'
import './style/globals.css'
import ComponentModal from './components/common/Modal'

function App() {
  return (
    <Router>
      <Workspaces />
      <ComponentModal />
    </Router>
  )
}

export default App

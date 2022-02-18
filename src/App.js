import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './components/Header';
import Feed from './components/Feed';

const App = () => {
  const [user, setUser] = React.useState(null);

  // Login
  async function login(user = null) {
    setUser(user);
  }

  // logout
  async function logout() {
    setUser(null);
  }

  // Fetch entry
  
  // Add entry

  // Delete entry

  // Update entry



  return (
    <Router>
      <Header />
      <Feed />
    </Router>
  )
}

export default App;
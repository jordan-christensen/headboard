import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import Feed from './components/Feed';
import NewPost from './components/NewPost';

const App = () => {

  // Fetch entry
  
  // Add entry

  // Delete entry

  // Update entry



  return (
    <div className="App">
      <header>
        <nav>
          <img src={require('./assets/images/logo.png')} alt="logo"/>
          <Link to={"/feed"} className="nav-link">
            Feed
          </Link>
          <Link to={"/post"} className="nav-link">
            Create Post
          </Link>
        </nav>
      </header>
      <Routes>
        <Route exact path={["/", "/feed"]} component={Feed}/>
        <Route 
          path="/post"
          render={(props) => (
            <NewPost />
          )}
        />
      </Routes>
    </div>
  )
}

export default App;
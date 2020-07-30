import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
import ImageSearch from "./ImageSearch"
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={ImageSearch}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

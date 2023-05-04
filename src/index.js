import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// ------------------------------------
import CheckMail from './components/CheckMail';
import Error404 from './components/Error404';
import Login from './components/Login';
import Register from './components/Register';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
     <Switch>
      <Route exact path="/" component={Login}/>
      {/* <Route exact path="/" component={App }/> */}
      <Route exact path="/components/register" component={Register }/>
    </Switch>
  </Router>,

);

reportWebVitals();

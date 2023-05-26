import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

// ------------------------------------
import CheckMail from './components/CheckMail';
import Error404 from './components/Error404';
import Login from './components/Login';
import Register from './components/Register';
import Welcome from './components/Welcome';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
     <Switch>
     <Route
        exact
        path="/"
        render={() => {
            return (
              <Redirect to="/Home" /> 
            )
        }}
      />
      <Route path='/Home' component={Welcome} />
      <Route path="/login" component={Login}/>
      <Route path="/chatroom/global" component={App }/>
      <Route path="/register" component={Register }/>
      <Route path="/checkmail" component={CheckMail} />
    </Switch>
  
  </Router>,

);

reportWebVitals();

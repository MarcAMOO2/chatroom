import React from "react";
import { Button } from '@mui/material'
import '@mui/icons-material';


import { BrowserRouter as Router, Route, Redirect, Link, Switch } from 'react-router-dom';

import Register from "./Register";
import Login from "./Login";


function Welcome() {
    const RedirectLogin = () => {
        console.log("Redirect to login page")
        return (
            <>
                <Router>
                    <Route path="./components/login" component={Login}></Route>
                </Router>
            </>
        )
    }

    const RedirectSignup = () => {
        console.log("Redirect to signup page");
    }

    return (
        <>
            <Router>
                <Route path='/login' element={<Login />} />
            </Router>
            <header>
                <h1>Chatta</h1>
                <h3>To begin chatting, either login or signup!</h3>
            </header>
            <hr>
            </hr>
            <div className="accountAuth">
                <Button
                    variant="contained"
                    onClick={RedirectLogin}
                >Login</Button>
                <Button 
                    variant="contained"
                    onClick={RedirectSignup}
                >Signup</Button>
            </div>
        </>
    );
}

export default Welcome;
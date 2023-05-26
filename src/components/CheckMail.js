import React, {useState} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from 'react-router-dom';
import Login from "./Login";

import "./stylesheets/CheckMail.css";
import {Button, TextField, Alert} from '@mui/material';


function CheckMail() {
    let history = useHistory();
    const [pressedBtn, setPressedBtn] = useState(false);

    const openLogin = () => {
        setPressedBtn(true);
    }
    return (
        <>
        <div className="checkMail">
        <Router>
            {pressedBtn ? history.push("/login") : console.log("error transportation to Login")} 
            <Switch>
                <Route path='/login' element={<Login />} />
            </Switch>
        </Router>

            <h1>We have just send you an email!</h1>
            <p>In order to begin chatting on here, we require you to verify your identity and ensure the information provided is correct</p>
            <p>Check your email provider (Google, Outlook ect.) inbox for the verification! When found, open the link and you will be able to begin chatting! </p>
            <h3>Your email is: <a href="">{sessionStorage.getItem('userEmail')} </a></h3>
            <button onClick={openLogin}>Login</button>
            <b>When you have confirmed your email, press the button and log in to your account</b>

        </div>
        </>
        
    );

}


export default CheckMail;
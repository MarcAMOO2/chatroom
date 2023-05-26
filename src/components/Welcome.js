import React, {useState} from "react";
import { Button } from '@mui/material'
import '@mui/icons-material';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from 'react-router-dom';

import Register from "./Register";
import Login from "./Login";

import "./stylesheets/Welcome.css";


function Welcome() {
    const history = useHistory();


    const CreateAnAccount = () => {
        console.log("Requested to create a new account");
        setTimeout(() => {
            history.push("/register");
        }, 1000);
    }
    const RedirectLogin = () => {
        console.log("Requested to login to an account");
        history.push("/login");

    }

    
    return (
        <>
        <div className="welcome">
            <header>
                <h1>Chatta</h1>
                <span>Fast and Reliable Live Chatroom! For Free; Forever</span>

                <div className="buttons">
                <Button
                    color="primary"
                    size="large"
                    variant="filledTonal"
                    onClick={CreateAnAccount}
                    className="createAccountButton"
                >Create an account</Button>
                </div>
                <div className="buttons">
                <Button
                    color="primary"
                    size="large"
                    variant="filledTonal"
                    onClick={RedirectLogin}
                    className="loginToAccountBtn"
                >Login</Button>
                </div>
            </header>
        </div>
        </>
    );
}

export default Welcome;
import React, { useState, useEffect } from "react";
import {Button, TextField, Alert} from '@mui/material';


import { createClient } from "@supabase/supabase-js";

import App from "./App";
import './stylesheets/Login.css';

import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from 'react-router-dom';;

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvb2NqdXhvbXB0Y255amdhZ3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE5OTQ3NDEsImV4cCI6MTk5NzU3MDc0MX0.pSuxWo7XIjpa5uB39I4sCRy-w1DAFgbkMiIynMBOw-E';
const SUPABASE_URL = "https://foocjuxomptcnyjgagyh.supabase.co";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);



function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [username, setUsername] = useState("");

    const [access_token, refresh_token] = useState("");


    const history = useHistory();


    //On page load function
    useEffect(() => {
        
        let sessionData = "";
        supabase.auth.onAuthStateChange((event, session) => {
            console.log(event);
            if (event === "SIGNED_IN") { //IF EVENT = SIGNED IN OR INITAL SESSION 
                // Update the global session data variable
                sessionData = session;
                setLoggedIn(true);
            } 
            else {
                // Clear the global session data variable
                sessionData = null;
                setLoggedIn(false);
            }
        });
    })


    const SubmitLogin =  async () => {
        console.log("User requested to login");
        
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if(error) {
            console.warn("Error Signing in user - DEBUG ONLY: " + error);
            setLoggedIn(false);
        } else {

            console.log("Logged in ", data);
            console.log(data.user.email);
            sessionStorage.setItem("user", data.user.user_metadata.username);
            sessionStorage.setItem("userEmail", data.user.email);
            
            //Saving to cookies/localstorage

        

            // Redirecting the page to the chatapp w auth cert
            return (
            <Redirect to={{
                pathname: "/chatroom/global",
                state: { username: data.user.email },
              }}
            ><App 
                setUsername={data.user.email}
            />
            </Redirect>
            );
        }      
    };
    if (isLoggedIn | setLoggedIn) {
        return (
            <Redirect to={{
                pathname: "/chatroom/global",
            }} />
        );
    }
    


    return (
        <> 
        <div className="login">   
        <Router>
            <Switch>
                <Route path="/chatroom/global" element={<App setUsername={setUsername} />} />
            </Switch>
        </Router>
        <h1>Login to your existing account</h1>
        <form>
            <TextField
                id='email'
                type='email'
                placeholder='example@domain.com'
                size='large'
                value={email}
                onChange={(e) => setEmail(e.target.value)}       
                required
            ></TextField>
            <p></p>
            <TextField
                id='password'
                type='password'
                placeholder='Password'
                size='large'
                value={password}
                onChange={(e) => setPassword(e.target.value)}       
                required
            ></TextField>
            <p></p>
            <Button
                variant='contained'
                size='large'
                onClick={SubmitLogin}
                
            >Login</Button>

        </form>
        </div>
        </>     
    );  
}


export default Login;
import React, { useState } from "react";
import {Button, TextField, Alert} from '@mui/material';

import { createClient } from "@supabase/supabase-js";

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import App from "./App";

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvb2NqdXhvbXB0Y255amdhZ3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE5OTQ3NDEsImV4cCI6MTk5NzU3MDc0MX0.pSuxWo7XIjpa5uB39I4sCRy-w1DAFgbkMiIynMBOw-E';
const SUPABASE_URL = "https://foocjuxomptcnyjgagyh.supabase.co";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setLoggedIn] = useState(false);


    let sessionData = null;
    supabase.auth.onAuthStateChange((event, session) => {
        console.log(event);
        if (event === "SIGNED_IN") { //IF EVENT = SIGNED IN OR INITAL SESSION 
          // Update the global session data variable
          sessionData = session;
          console.log("Logged in successfully");

          setLoggedIn(true);
        } 
        // else if(event === "INITIAL_SESSION") {
        //     sessionData = session;
        //     console.log("User is logged in");
        //     setLoggedIn(true);
        // }
        else {
          // Clear the global session data variable
          sessionData = null;
          console.log("User is not logged in");
          setLoggedIn(false);
        }
      });
    



    const SubmitLogin =  async () => {
        console.log("User requested to login");

        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if(error) {
            console.warn("Error Signing in user - DEBUG ONLY: " + error);
        }
        
        
            
    }


    return (
        <>
            
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


        </>
        
    );  
}

export default Login;
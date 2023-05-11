import '../App.css';
import { React, useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";

import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from 'react-router-dom';

import '@mui/material/styles'; // neccessary for
import {TextField, Button, CircularProgress } from '@mui/material';

import Login from './Login';


const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvb2NqdXhvbXB0Y255amdhZ3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE5OTQ3NDEsImV4cCI6MTk5NzU3MDc0MX0.pSuxWo7XIjpa5uB39I4sCRy-w1DAFgbkMiIynMBOw-E";
const SUPABASE_URL = "https://foocjuxomptcnyjgagyh.supabase.co";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);




function App(props) {
  const [message, setMessage] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  const [latestMessageId, setLatestMessageId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(props.setUsername);

  const history = useHistory(); //react router dom


  //----------------------------------------------------
  // ** SCROLLING TO BOTTOM ON TEXT TAB (MESSAGES)
  //----------------------------------------------------
  const ScrollToBottom = () => {
    var messagesElement = document.getElementById("messages-container");
    messagesElement.scrollTop = messagesElement.scrollHeight;
  }
  

  const SubmitMessage = async () => {
    console.log(setUsername);
    console.log("Message send requested; sent with: " + message + " SENT BY: " + username);
    //-----------------------------------------------
    //Checking if the message has content, otherwise, continue
    //-----------------------------------------------
      
      //Client Side displaying message for the user
      // var messageContainer = document.getElementById("messages");
      // let el = document.createElement('div');
      // el.setAttribute('class', 'message my-message');
      // el.innerHTML = `
      //   <div>
      //       <div class='name'>You</div>
      //       <div class='text'>${message}</div>
      //   </div>
      // `;
      // messageContainer.appendChild(el);


      // ----------------------------------------------
    
      //Server Side - Sending message to DB
      const { data, error } = await supabase 
      .from("msgs")
      .insert({ user_sent: username, content: message }); // sends the username and message content along with the time sent
      console.log('data:', data);
      console.log('error:', error); //Debugging the code

      document.getElementById("message").value = "";
  } //const function closer

  //-----------------------------------------------------
  // Fetching the messages every second
  //-----------------------------------------------------
  
  useEffect(() => {
    let user = localStorage.getItem("user");
    setUsername(user);

    const messageCall = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('msgs')
          .select('id, user_sent, content')
          .gt('id', latestMessageId || 0)
          .order('id', { ascending: true });
        
        if (error) throw error;
        
        if (data.length > 0 || !isExpired) {
          setLatestMessageId(data[data.length - 1].id);
          setMessages((prevMessages) => [...prevMessages, ...data]);
          document.getElementById("messageLoaderAwait").hidden = true;
          ScrollToBottom();
        }
        
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }, 1500);

    return () => clearInterval(messageCall);
  }, [latestMessageId]);
  

  //----------------------------------------------------
  //Anonymous saving username
  //----------------------------------------------------




  window.onload = function() {
    setTimeout(checkToken, 5000);
  }
  const checkToken = async () => {
    try {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) throw error;
  
      if (!session || !session.user) {
        console.log("The session has expired");
        setIsExpired(true);
        return;
      }
      
      console.log("Session: ", session);
    
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('id', session.user?.id)
        .single();
  
      if (userError) throw userError;

  
      console.log("User email:", user.email);
  
      if (user.email === session.user.email) {
        console.log("Logged in user email matches session data email");
      } else {
        console.log("Logged in user email does not match session data email");
      }
  
      setUsername(session.user.email);
    } catch (error) {
      console.error("Error getting session data:", error);
    }
  };

  if(isExpired) {
    history.push("/login");
  }
  

  return (
    <>
    <Router>
      <Route path="/login" />
    </Router>

        <header>
          <h1>Currently Viewing as: </h1>
          <p>Set your name to display when you send messages</p>
        </header>
        

          <div className="messages-container" id='messages-container'>
            <div className="messages" id='messages'>
              <div className='messageLoaderAwait' id='messageLoaderAwait'>
                <CircularProgress 
                  />
                  <p>Wait while we fetch your chat history :)</p>
              </div>
            {messages.map((message) => (
              <div key={message.id}>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" 
                  alt="User Profile"
                  width="40px"></img>
                <p>
                  <span className='externalUser'>
                    {message.user_sent}
                  </span>: <br></br>{message.content}</p>
              </div>
            ))}
            </div>
          </div>

          <div className="chatInput">
            <TextField 
              type='text'
              id='message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              ></TextField>
            <Button 
              variant='outlined'
              size='large'
              onClick={SubmitMessage}
            >sEND</Button>
          </div>
    </>
  );
}

export default App;

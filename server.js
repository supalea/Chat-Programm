// npm i 


import express from "express";
import { readFile, writeFile } from 'fs/promises';
import bodyParser from 'body-parser';
import {createServer} from "http";
import { Server as SocketIOServer } from 'socket.io';


const app           = express();
const IP            = "127.0.0.1";
const PORT          = 8081;

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

app.use(bodyParser.urlencoded({ extended: true }));   // parst URL codierte Daten
app.use(bodyParser.json());                           // kann json Daten verarbeiten

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function getRandomColor() {
const letters = '0123456789ABCDEF';
let color = '#';
for (let i = 0; i < 6; i++) {
color += letters[Math.floor(Math.random() * 16)];
}
return color;
}


app.post('/register', async(req, res) => {
  const newUser = req.body;
  
  
  try {
    const data = await readFile('./public/login.json', 'utf8');
    const users = JSON.parse(data);

    const existingUser = users.benutzer.find(user => user.username === newUser.username);
    const passwortTest = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*])(.{6,})$/
    let control = passwortTest.test(newUser.password)
    if (!existingUser && newUser.username != "") {
                  console.log('Name noch verfügbar');
                    if (control) {
                        newUser.color = getRandomColor()
                        users.benutzer.push(newUser);
                        await writeFile('./public/login.json', JSON.stringify(users));
                        console.log("Registriert");
                    }}
  } catch (err) {
    console.error(err);
  }
});
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
  });
  



// const chatHistory = [];                // chathistory speichern 

io.on("connection", socket => {
  
  socket.on("new-user", username => { 
    console.log(username);              
    socket.username = username;  
    io.emit("user-join", `${username} joined`);
  })
  
  // socket.on("save-color", userColor => {
  //   socket.userColor = userColor
  //   console.log(userColor);
    
  // })

  socket.on("disconnect", () => {   
    if (socket.username) {
      io.emit("user-disconnect", `${socket.username} disconnected`);
      delete socket.username
    }           
  })


  socket.on("send", message =>{
    console.log(message);
    const chatMessage = {
      username: socket.username,
      message: message        
    }
    // chatHistory.push(chatMessage);
    io.emit("chat-message",chatMessage)
  });
  
});





  httpServer.listen(PORT, () => {
    console.log(`Server läuft auf Port http://${IP}:${PORT}`);
  });

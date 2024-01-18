"use strict";

// Chat Programm
/*
    Eingabefeld Login
    Neue Registrierung? mit Ajax registrieren
    passwort mit blabla zeichen etc.
    Datenbank mit Benutzername und Passwort
    Server
    Storage
    Mit namen begrüst werden
    Chatfunktion
    socket.io
    leere nachricht nicht versenden
    disconnect
    abmelden button
    Stroage löschen beim abmelden
    scrollen
    falsches Passwort anzeigen 

    Passworteingabe mit ****
    

    hübsch aussieht 
        Chat aufbau
        joined nachricht hubsch machen
        wenn nicht im local storge ist dann andere farbe und links
   
    
*/


let userSubmit = document.querySelector("#username");
let passwordSubmit = document.querySelector("#password");
let buttonLogin = document.querySelector("#btn-log")
let loginSide = document.querySelector("#login")
let buttonReg = document.querySelector("#btn-reg")
let regSide = document.querySelector("#register")
let form1 = document.querySelector("#form1")
let form2 = document.querySelector("#form2")
let fehler = document.querySelector("#error")
let vorhanden = document.querySelector("#exist")
let newUser = document.querySelector("#neuerusername")
let newPassw = document.querySelector("#neuespasswort")
let check = document.querySelector("#check")
let anmelden = document.querySelector("#btn-anm")
let mind = document.querySelector("#mind")
let chatPage = document.querySelector("#chat")
let message = document.querySelector("#message")
let formSend = document.querySelector("#send")
let eingabe = document.querySelector("#eingabe")
let abmelden = document.querySelector("#btn-abm")
let wrongPassword = document.querySelector("#wrongPasw")
let currentPage = localStorage.getItem('currentPage');
let currentUser = localStorage.getItem('username')
let color = localStorage.getItem("color")
let show = document.querySelector("#show")
let show2 = document.querySelector("#show2")
fehler.classList.add("hide");

show.addEventListener("click", function(){
    if (passwordSubmit.type === 'password') {
        passwordSubmit.type = 'text';
    } else {
        passwordSubmit.type = 'password';
    }
})
show2.addEventListener("click", function(){
    if (newPassw.type ==="password") {
        newPassw.type= "text"
    } else {
        newPassw.type= "password"
    }
})

function socket(user){
    let socket = io();
    currentUser
    
    let username = user
    console.log(username);
    socket.emit('new-user', username)                   // name wird in socket gespeichert
    // socket.emit('save-color', userColor)
    // console.log(userColor);

    socket.on("user-join", function(msg) {              // name joined
        join(msg)
        
    });
    
    socket.on("user-disconnect", function(msg) {            
        join(msg)
       
    }); 

    socket.on("chat-message", data =>{
        if(data.message != ""){
                appendMsg(data)
        }
        
        // wenn username im storage gespeichert ist dann class hinzufügen mit "ich" 
    })


    
    formSend.addEventListener("submit", e =>{           
        e.preventDefault();
        const inputMsg = eingabe.value;
        if(inputMsg != ""){
            socket.emit("send", inputMsg)
            eingabe.value = ""
        }            
        
    })
    function join (msg){
        const elem = document.createElement("div")
        elem.classList.add("joined")
        elem.innerText = msg
        console.log(msg);
        message.append(elem)
    }

    function appendMsg(data){                           
        
        // let ich = localStorage.getItem(`${username}-color`)
        currentUser
        if(data.username === currentUser){
            const elem = document.createElement("div")
            elem.classList.add ("ich")
            elem.innerText = `${data.username}: ${data.message}`;
            message.append(elem)
        }else{
            const elem = document.createElement("div")
            elem.style.color = color
            elem.classList.add ("other")
            elem.innerText = `${data.username}: ${data.message}`;
            message.append(elem)
        }

    }
    abmelden.addEventListener("click", function(){
    loginSide.style.display = 'block';
    regSide.style.display = 'none';
    chatPage.style.display = 'none';
    
    location.reload();
    
    localStorage.clear();
    })
}



    


// Chat

let chat = document.addEventListener('DOMContentLoaded', function() {
    currentPage
    currentUser
    if (currentPage === 'chatPage') {
        loginSide.style.display = 'none';
        regSide.style.display = 'none';
        chatPage.style.display = 'block';
        if(currentUser){
                socket(currentUser);
        }

    } else {
        loginSide.style.display = 'block';
        regSide.style.display = 'none';
        chatPage.style.display = 'none';
    }
});



form1.onsubmit = function(){
    submitFunc();
}
form2.onsubmit = function(){
    submitFunc();
}



const submitFunc = function(){
    const xhr = new XMLHttpRequest;     // login.json datei empfangen
    xhr.onload = function(){
        if(xhr.status != 200) return;
        const jsonData = xhr.response;
       
        checkLogin(jsonData)
        checkReg(jsonData)
        
    }

    xhr.open("GET", "login.json")
    xhr.responseType ="json";
    xhr.send()
}


//Login
const checkLogin = function(data){
    
    const benutzer = data.benutzer
    let user;
    for(let i=0; i<benutzer.length;i++){
        // if eingegeben name der selbe wie in der datenbank dann weiter
        if(benutzer[i].username == userSubmit.value.trim()){
            user = benutzer[i]
            
        }
    }
    if (!user) {
            wrongPassword.style.display ="none"
            fehler.style.display ="block"           // wenn es nutzer nicht gibt = fehler
            
        }else if(userSubmit.value != "" && passwordSubmit.value == user.password){
            location.reload();
            fehler.style.display = "none"           // nutzer existiert, chat seite wird geöffnet
            login.style.display="none"
            chatPage.style.display="block"          // Chat Seite
            
            
           
            let userSub = userSubmit.value
            localStorage.setItem(`${userSub}-color`, user.color)
            localStorage.setItem('currentPage', 'chatPage'); 
            localStorage.setItem('username', userSub)
            socket(userSub);
            

        }else{   
            wrongPassword.style.display ="block"
            fehler.style.display="none"
              
        }

}

// Registrieren

buttonReg.addEventListener("click", function(){
     // geh auf die registrieren seite
    loginSide.style.display = "none";
    regSide.style.display = "block";
    chatPage.style.display = "none";

    userSubmit.value="";
    passwordSubmit.value="";
})
   
const checkReg = function(data){
    // ist username bereits vorhanden?
    const vorhandenerName = data.benutzer
    let user;
    for(let i=0; i<vorhandenerName.length;i++){
        if(vorhandenerName[i].username == newUser.value.trim()){
            user = vorhandenerName[i]
        }
    }
    if (!user && newUser.value.trim() !== "") {             // wenns den namen noch nicht gibt
            
            vorhanden.style.display ="none"
            check.style.display="block"                     // Name noch verfügbar

            const passwortTest = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*])(.{6,})$/       // passwort mind. 6 zeichen groß klein schreibung sonderzeichen
            let control = passwortTest.test(newPassw.value)
            
            if(control){
                mind.style.display ="none"

            // server.js pusht anmeldedaten in die JSON Datei 
         
                // zurück zur Login Seite 
                loginSide.style.display ="block"
                regSide.style.display="none"
                fehler.style.display ="none"
                newUser.value=""
                newPassw.value=""


            }else{
                mind.style.display="block"
                console.log("Passwort muss mind. 6 Zeichen, mind. 1 Großbuchstabe mind. 1 Sonderzeichen(!@#$%^&*) und eine Zahl beeinhalten");
            }
            
    }else if (newUser.value.trim() === ""){                 // Error wenn leeres feld
        check.style.display="none"
        vorhanden.style.display ="none"

    }else {                                                 // wenns ihn gibt
            check.style.display="none"                      // Name schon vorhanden
            vorhanden.style.display ="block"
    }    
}








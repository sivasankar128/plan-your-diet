const express = require("express");
const request = require('request');
const app = express();
const port =3000;
const passwordhash = require('password-hash');
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var serviceAccount = require("./keyg.json");
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
app.set("view engine", "ejs");
///////////////////////////
var data=[];
db.collection("DIET")
.get()
.then((docs) => {
  docs.forEach((doc) => {
    data.push(doc.data());
  });
})
  app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html");
  });
/////////////////////////////
//LOGIN

app.get("/loginsubmit", (req, res) => {
  const email = req.query.Email;
  db.collection("DIET")
    .where("email", "==", email)
    .get()
    .then((docs) => {
      let result = false;
      let usrnm = "";
      let mail="";
      docs.forEach((doc) => {
        const hashp = doc.data().password;
        result = passwordhash.verify(req.query.password, hashp);

        if (result) {
          usrnm = doc.data().name;
          mail= doc.data().email; 

          if (
            (email == "sivasankaravula128@gmail.com" && req.query.password == "Siva@128" ) || (email == "badrinath123@gmail.com" && req.query.password == "123abc")) {
            res.render("dashboard", { userData: data, usrnm } );  
          }
          else {
            res.render("index", { usrnm , mail}); 
          }
        } else {
          res.send("loginfailed");
        }
      });
    })
    .catch(error => {
      console.error("Error getting documents: ", error);
      res.send("An error occurred during login.");
    });
});




//SIGNUP
  app.get("/signup",(req,res)=>{
    res.sendFile(__dirname+"/signup.html");
  });

  app.post("/signupsubmit", (req, res) => {
    const user_name = req.body.username;
    const email = req.body.Email;
    const password = req.body.password;
    const phonenumber = req.body.phno;
      db.collection("DIET").
      where("email","==",email)
        .get()
        .then((docs)=>{
          if(docs.size>0){
            res.send("signup failed");
          }
          else{
            db.collection("DIET")
              .where("name","==",user_name)
              .get()
              .then((docs)=>{
                if(docs.size>0){
                  res.send("signup failed");
                }
                else{
                  db.collection("DIET")
                  .add({
                    name: user_name,
                    email: email,
                    password: passwordhash.generate(password), 
                    phonenumber: phonenumber
                  })
                  .then(() => {
                    res.sendFile(__dirname+"/login.html");
                  })
                  .catch(()=>{
                    res.send("SIGNUP FAILED.. PLEASE TRY AGAIN");
                  })
                }
              })
          }
        })
    });
    

  app.get('/main', (req, res) => {
    res.sendFile(__dirname+"/indexdup.html");
  });
  app.get('/mainpage', (req, res) => {
    res.sendFile(__dirname+"/mainpage.html");
  });
  app.get('/login.html', (req, res) => {
    res.sendFile(__dirname+"/login.html");
  });
  app.get('/diabetes.html', (req, res) => {
    res.sendFile(__dirname+"/diabetes.html");
  });

  app.get('/indexdup.html', (req, res) => {
    res.sendFile(__dirname+"/indexdup.html");
  });
  app.get('/index.html', (req, res) => {
    res.sendFile(__dirname+"/indexdup.html");
  });

  app.get('/bloodpressure.html', (req, res) => {
    res.sendFile(__dirname+"/bloodpressure.html");
  });

  app.get('/aasthma.html', (req, res) => {
    res.sendFile(__dirname+"/aasthma.html");
  });

  app.get('/thyroid.html', (req, res) => {
    res.sendFile(__dirname+"/thyroid.html");
  });

  app.get('/gym.html', (req, res) => {
    res.sendFile(__dirname+"/gym.html");
  });

  app.get('/week1.html', (req, res) => {
    res.sendFile(__dirname+"/week1.html");
  });

  app.get('/week2.html', (req, res) => {
    res.sendFile(__dirname+"/week2.html");
  });
  app.get('/week3.html', (req, res) => {
    res.sendFile(__dirname+"/week3.html");
  });

  app.get('/week4.html', (req, res) => {
    res.sendFile(__dirname+"/week4.html");
  });

  app.get('/tracker.html', (req, res) => {
    res.sendFile(__dirname+"/tracker.html");
  });

  app.get('/aboutus.html', (req, res) => {
    res.sendFile(__dirname+"/aboutus.html");
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
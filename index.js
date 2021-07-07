const express = require('express');
const bodyParser =  require('body-parser');
const cors =  require('cors');
const { MongoClient } = require('mongodb');
const app = express();
app.use(bodyParser.json());
app.use(cors());
require('dotenv').config()

const port =process.env.DB_HOST;

console.log(process.env.DB_USER)

const admin = require('firebase-admin');
const ObjectId = require('mongodb').ObjectID;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.okztc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const bookings = client.db("burjArab").collection("booking");
  
    app.post('/addBooking',(req,res)=>{
        const booking = req.body;
       bookings.insertOne(booking)
       .then(result=>{
          res.send(intertedCount >0)
       })
    });
    app.get('/bookings',(req,res)=>{
      const Bearer= (req.headers.authorization);
        if (Bearer && Bearer.startsWith('Bearer ')) {
            const idToken = Bearer.split(' ')[1];
            console.log(idToken)
            admin
            .auth()
            .verifyIdToken(idToken)
            .then((decodedToken) => {
                const tokenEmail = decodedToken.email;
                const quaryEmail = req.query.email;
                console.log(tokenEmail,quaryEmail)
               if (tokenEmail ==quaryEmail) {
                        
                bookings.find({email:quaryEmail})
                .toArray((err,document)=>{
                    res.send(document)
                })
               }
                // ...
            }) .catch((error) => {
                // Handle error
            });
        }
        else{
            res.status(401).send('un-authorized')
        }

    
      
    });
    

    app.delete('/delete/:id',(req,res)=>{
      
       bookings.deleteOne({id:ObjectId(req.params.id)})
       .then(result=>{
        console.log(result)
       })
    })
    
});
const serviceAccount = require("./buj-al-arab-auth-with-mongodb-firebase-adminsdk-k48bq-8047140af1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.get('/',(req,res)=>{
    res.send('this is express')
});

app.listen(port)
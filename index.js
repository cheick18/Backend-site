const express = require('express')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const corsOptions = {
  origin: 'https://www.famindaconcept.com', // Remplace par le domaine que tu veux autoriser
  methods: ['GET', 'POST'], 
  credentials: true, 
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {

user:  process.env.SECRET_MAIL,
  
 pass: process.env.SECRET_PASS
  }
});


const users = {}; // { email: { passwordHash: '', resetToken: '' } }
const tokens = {}; // Pour la validation des tokens





app.post('/request-reset', (req, res) => {
    console.log("hello le monde")
    const encodedData = req.query.mail;
  //  console.log("votre mail est",encodedData)
    const { name, lastName, number,EMail, Message, organigrame} = req.body;
   console.log(name, lastName,  number,  EMail,  Message)

  
 // const token = crypto.randomBytes(20).toString('hex');
 // tokens[token] = 'zilatan210@gmail.com';



  const resetLink = 'google.com';

  const mailOptions = {
    from:  process.env.SECRET_MAIL,
    to:  process.env.SECRET_MAIL, 
    subject: `Message de ${name+" "+lastName}`,
    html: `
      <p>Message de ${name} ${lastName}</p>
      <p>Numéro: ${number}</p>
         <p>Organisme: ${organigrame}</p>
        <p>Message: ${Message}</p>
         <p>Email: ${EMail}</p>
    `,
    replyTo:  EMail
};


transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      return res.status(500).send(error.toString());
  }
  res.status(200).send('Email sent: ' + info.response);
});
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'SendMail.html'));

}
)

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur ${PORT}`);
});

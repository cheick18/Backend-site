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


app.post('/request-reset', async (req, res) => {
  try {
    console.log("=== REQUEST RECEIVED ===");

    // Vérifier le body
    console.log("BODY:", req.body);

    const { name, lastName, number, EMail, Message, organigrame } = req.body;

    if (!name || !lastName || !EMail) {
      console.log("❌ Champs manquants");
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    console.log("DATA:", { name, lastName, number, EMail, Message, organigrame });

    // Vérifier les variables d'env
    console.log("ENV MAIL:", process.env.SECRET_MAIL);
    console.log("ENV PASS:", process.env.SECRET_PASS ? "OK" : "MISSING");

    const mailOptions = {
      from: process.env.SECRET_MAIL,
      to: process.env.SECRET_MAIL,
      subject: `Message de ${name} ${lastName}`,
      html: `
        <p><b>Nom:</b> ${name} ${lastName}</p>
        <p><b>Numéro:</b> ${number}</p>
        <p><b>Organisme:</b> ${organigrame}</p>
        <p><b>Message:</b> ${Message}</p>
        <p><b>Email:</b> ${EMail}</p>
      `,
      replyTo: EMail
    };

    // Envoi du mail (version await)
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ MAIL SENT:", info.response);

    return res.status(200).json({
      success: true,
      message: "Email envoyé",
      response: info.response
    });

  } catch (error) {
    console.error("🔥 ERREUR SERVER:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack // 👈 super utile en dev (à enlever en prod après)
    });
  }
});


/*
app.post('/request-reset', (req, res) => {
  console.log("voici le server")
    console.log("hello le monde")
    const encodedData = req.query.mail;
 
    const { name, lastName, number,EMail, Message, organigrame} = req.body;
   console.log(name, lastName,  number,  EMail,  Message)

  




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
*/

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'SendMail.html'));

}
)

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur ${PORT}`);
});

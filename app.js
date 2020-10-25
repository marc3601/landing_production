const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");
const port = process.env.PORT || 5000;
const ip = process.env.IP || "51.195.91.42";
const app = express();

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//public folder
app.use(express.static(path.join(__dirname, "build")));
const confirm = {
  info: "Wiadomość wysłana poprawnie",
};
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/send", (req, res) => {
  const output = `
  <p>Nowa wiadomość:</p>
  <h3>Dane kontaktowe</h3>
  <ul>
  <li>Imię: ${req.body.name}</li>
  <li>Mail: ${req.body.mail}</li>
  <li>Wiadomość: ${req.body.message}</li>
  </ul>
  `;

  async function main() {
    let transporter = nodemailer.createTransport({
      host: "ssl0.ovh.net",
      port: 465,
      secure: true, 
      auth: {
        user: "marcin@sesjefotograficzne.eu", 
        pass: "Mmknkpe12", 
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // send mail with defined transport object
    await transporter.sendMail({
      from: `${req.body.name} 📧 <${req.body.mail}>`, // sender address
      to: "marcin@sesjefotograficzne.eu", // list of receivers
      subject: `${req.body.name}`, // Subject line
      html: output, // html body
    });
    console.log(`Message from ${req.body.mail} has been sent!`);
    res.send(confirm);
  }
  main().catch(console.error);
});

app.listen(port, ip);

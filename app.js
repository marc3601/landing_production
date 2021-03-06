const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");
const helmet = require("helmet");
const port = process.env.PORT || 5000;
const ip = process.env.IP || "51.195.91.42";
const app = express();
app.use(helmet());
//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//public folder
app.use(express.static(path.join(__dirname, "build")));
const confirm = {
  info: "Wiadomość wysłana poprawnie",
};
const confirm2 = {
  info: "Wystąpił błąd",
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
        user: "kontakt@webdev-online.pl",
        pass: "Mmknkpe12",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // send mail with defined transport object
    await transporter
      .sendMail({
        from: `${req.body.name} 📧 <${req.body.mail}>`, // sender address
        to: "kontakt@webdev-online.pl", // list of receivers
        subject: `${req.body.name}`, // Subject line
        html: output, // html body
      })
      .then(() => {
        console.log(`Message from ${req.body.mail} has been sent!`);
        res.send(confirm);
      })
      .catch(() => {
        console.log(`Unable to send!`);
        res.send(confirm2);
      });
  }
  main().catch(console.error);
});

app.listen(port, ip);

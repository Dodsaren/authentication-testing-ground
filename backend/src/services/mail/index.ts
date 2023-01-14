import nodemailer from 'nodemailer'

let transporter = nodemailer.createTransport({
  port: 1025,
  secure: false, // upgrade later with STARTTLS
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
})

transporter.verify(function (error, success) {
  if (error) {
    console.log(error)
  } else {
    console.log('SMTP server connection established')
  }
})

export const mailer = transporter

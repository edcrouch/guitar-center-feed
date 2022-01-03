import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import EmailService from '../notify/email-service.mjs'

const result = dotenv.config()

if (result.error) {
  console.log('.env not found -- using system environment only')
}

export function mailFactory() {
  return new EmailService(
    nodemailer.createTransport({
      host: process.env.SMTP_ADDRESS,
      port: process.env.SMTP_PORT_SSL,
      secure: true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      }
    }, {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_ADDRESS}>`
    })
  )
}
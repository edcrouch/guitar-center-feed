export default class EmailService {
  #transport
  constructor(transport) {
    this.#transport = transport
  }

  async sendMail(to, subject, text, html) {
    return this.#transport.sendMail({to, subject, text, html})
  }
}
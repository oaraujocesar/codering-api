'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} request */
/** @typedef {import('@adonisjs/framework/src/Response')} response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class SessionController {
  async login({ request, auth, response }) {
    const { email, password } = request.all();

    try {
      if (await auth.attempt(email, password)) {
        const { id, username } = await User.findBy('email', email);
        let user = { id, username, email };

        const token = await auth.generate(user);

        user = { ...user, token };

        return response.status(200).json(user);
      }
    } catch (err) {
      return response.status(400).json({ message: 'Erro na autenticação!' });
    }
  }
}

module.exports = SessionController;

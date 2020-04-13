'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} request */
/** @typedef {import('@adonisjs/framework/src/Response')} response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class UserController {
  async store({ request, response }) {
    try {
      const { id, name, username, email } = await User.create(request.all());
      const user = { id, name, username, email }

      return response.status(201).json(user);

    } catch (error) {

      return response.status(400).json({ message: 'Usuário já cadastrado!' });
    }
  }

  async show({params, request, response}) {
    try {

      const user = await User.find(params.id)

      return response.status(200).json(user)

    } catch (error) {
      return response.status(404).json({ message: 'Usuário não encontrado' });
    }
  }

  async update({ params, request, response }) {

    try {
      const user = await User.find(params.id)
      const data = request.all()

      user.merge(data);
      await user.save();
      delete user.password;

      return response.status(200).json({ message: 'Usuário atualizado', user});

    } catch (error) {
      return response.status(404).json({ message: 'Usuário não encontrado' });
    }

  }

  async destroy({ params, request, response }) {

    try{
      const user = await User.find(params.id);
      await user.delete();

      return response.status(200).json({ message: 'Usuário deletado com sucesso!'});
    } catch(error) {
      return response.status(404).json({ message: 'Usuário não encontrado' });
    }
  }
}

module.exports = UserController

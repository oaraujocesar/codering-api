'use strict';

const { trait, test } = use('Test/Suite')('User');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

trait('Test/ApiClient');
trait('Auth/Client');

test('it should create a user', async ({ client }) => {
  const { name, username, email, password } = await Factory.model(
    'App/Models/User'
  ).make();

  const data = {
    name,
    username,
    email,
    password,
  };

  const response = await client.post('/users').send(data).end();

  response.assertStatus(201);
  response.assertJSONSubset({
    name,
    username,
    email,
  });
});

test('it should return an error for user already created', async ({
  client,
}) => {
  const user = Factory.model('App/Models/User').create();

  const response = await client.post('/users').send(user).end();

  response.assertStatus(400);
  response.assertJSON({
    message: 'Usuário já cadastrado!',
  });
});

test('it should show an user', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .get(`/users/${user.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: user.name,
    username: user.username,
    email: user.email,
  });
});

test('it should return an error for not registered user', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client.get('/users/1').loginVia(user, 'jwt').end();

  response.assertStatus(404);
  response.assertJSON({
    message: 'Usuário não encontrado!',
  });
});

test('it should update an user', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();

  const data = {
    bio: 'Sou dev',
    facebook: 'facebook.com/MarkZukemberg',
    instagram: 'instagram.com/MarkZukemberg',
    github: 'github.com/microsoft',
    linkedin: 'linkedin/in/VintaSoftware',
  };

  const response = await client
    .put(`/users/${user.id}`)
    .loginVia(user, 'jwt')
    .send(data)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: data.bio,
    instagram: data.instagram,
    facebook: data.facebook,
    github: data.github,
    linkedin: data.linkedin,
  });
});

test('it should return a error for a not registered user when updating', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client.get('/users/53').loginVia(user, 'jwt').end();

  response.assertStatus(404);
  response.assertJSON({
    message: 'Usuário não encontrado!',
  });
});

test('it should delete an user', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .delete(`/users/${user.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
});

test('it should return a error for a not registered user when deleting', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client.delete('/users/1').loginVia(user, 'jwt').end();

  response.assertStatus(404);
  response.assertJSON({
    message: 'Usuário não encontrado!',
  });
});

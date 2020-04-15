'use strict';

const { trait, test } = use('Test/Suite')('User');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

trait('Test/ApiClient');
trait('Auth/Client');

test('it should create a user', async ({ client }) => {
  const user = {
    name: 'Cesinha da Vila1',
    username: 'cesinha1231',
    email: 'cesinhadogera1@gmail.com',
    password: '123456',
  };
  const response = await client.post('/users').send(user).end();

  response.assertStatus(201);
  response.assertJSON({
    id: response.body.id,
    name: 'Cesinha da Vila1',
    username: 'cesinha1231',
    email: 'cesinhadogera1@gmail.com',
  });
});

test('it should return an error for user already created', async ({
  client,
}) => {
  const user = {
    name: 'Cesinha da Vila1',
    username: 'cesinha1231',
    email: 'cesinhadogera1@gmail.com',
    password: '123456',
  };

  const response = await client.post('/users').send(user).end();

  response.assertStatus(400);
  response.assertJSON({
    message: 'Usuário já cadastrado!',
  });
});

test('it should show an user', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client
    .get(`/users/${user.id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(200);

  assert.exists(response.body.id);
  assert.exists(response.body.name);
  assert.exists(response.body.username);
  assert.exists(response.body.email);
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

test('it should update an user', async ({ assert, client }) => {
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

  assert.exists(response.body.user.id);
  assert.exists(response.body.user.name);
  assert.exists(response.body.user.username);
  assert.exists(response.body.user.email);
  assert.exists(response.body.user.bio);
  assert.exists(response.body.user.facebook);
  assert.exists(response.body.user.instagram);
  assert.exists(response.body.user.linkedin);
  assert.exists(response.body.user.github);
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

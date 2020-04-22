'use strict';

const { test, trait } = use('Test/Suite')('Post');

trait('Auth/Client');
trait('Test/ApiClient');

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

test('it should return the id from post when created', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const post = await Factory.model('App/Models/Post').make();

  const response = await client
    .post('/posts')
    .loginVia(user, 'jwt')
    .send(post)
    .end();

  response.assertStatus(201);
  response.assertJSON({
    id: response.id,
  });
});

test('it should return an error when create a post with an already used title', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();
  const post = await Factory.model('App/Models/Post').create();

  const response = await client
    .post('/posts')
    .loginVia(user, 'jwt')
    .send(post)
    .end();

  response.assertStatus(400);
  response.assertJSON({
    message: 'Não foi possivel criar o post',
  });
});

test('it should update a post', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const post = await Factory.model('App/Models/Post').make();

  await user.posts().save(post);

  const data = {
    title: 'Titulo Atualizado',
    description: 'Descrição Atualizada',
    content: 'Conteúdo atualizado',
  };

  const response = await client
    .put(`/posts/${post.id}`)
    .loginVia(user, 'jwt')
    .send(data)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    title: data.title,
    description: data.description,
    content: data.content,
  });
});

test('it should return an error when try to update a post not existent', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client.put('/posts/2').loginVia(user, 'jwt').end();

  response.assertStatus(404);
  response.assertJSON({
    message: 'Post não encontrado!',
  });
});

test('it should show a post', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const { id, title, description, content } = await Factory.model(
    'App/Models/Post'
  ).create();

  const response = await client.get(`/posts/${id}`).loginVia(user, 'jwt').end();

  response.assertStatus(200);
  response.assertJSONSubset({
    id,
    title,
    description,
    content,
  });
});

test('it should return an error whe try to show a post not existent', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client.get('/posts/1').loginVia(user, 'jwt').end();

  response.assertStatus(404);
  response.assertJSON({
    message: 'Post não encontrado!',
  });
});

test('it should index all posts', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create();
  await Factory.model('App/Models/Post').createMany(5);

  const response = await client.get('/posts').loginVia(user, 'jwt').end();

  response.assertStatus(200);

  assert.exists(response.body.posts);
});

test('it should delete the post when requested', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create();
  const post = await Factory.model('App/Models/Post').make();

  const { id } = await user.posts().save(post);

  const response = await client
    .delete(`/posts/${id}`)
    .loginVia(user, 'jwt')
    .end();

  response.assertStatus(204);
  assert.exists(response.body.message);
});

test('it should return an error when try to delete an post not existent', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').create();

  const response = await client.delete('/posts/2').loginVia(user, 'jwt').end();

  response.assertStatus(404);
  response.assertJSON({
    message: 'Post não encontrado!',
  });
});

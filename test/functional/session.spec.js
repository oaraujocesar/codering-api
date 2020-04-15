const { test, trait } = use('Test/Suite')('Auth');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

trait('Test/ApiClient');
trait('Auth/Client');

test('it should return a JWT when session created', async ({
  assert,
  client,
}) => {
  await User.create({
    name: 'Cesinha da Vila',
    username: 'cesinha123',
    email: 'cesinhadogera@gmail.com',
    password: '123456',
  });

  const response = await client
    .post('/login')
    .send({
      email: 'cesinhadogera@gmail.com',
      password: '123456',
    })
    .end();

  response.assertStatus(200);

  assert.exists(response.body.token);
});

test('it should return an error for authentication', async ({
  assert,
  client,
}) => {
  const response = await client
    .post('/login')
    .send({
      email: 'cesinhadogera@gmail.com',
      password: '1234567',
    })
    .end();

  response.assertStatus(400);

  assert.exists(response.body.message);
});

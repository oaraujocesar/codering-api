'use strict';

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

Factory.blueprint('App/Models/User', async (faker, i, data = {}) => {
  return {
    name: faker.name(),
    username: faker.word({ length: 7 }),
    email: faker.email(),
    password: faker.password(),
    ...data,
  };
});

Factory.blueprint('App/Models/Post', async (faker, i, data = {}) => {
  return {
    title: faker.sentence(),
    description: faker.sentence(),
    content: faker.paragraph(),
    ...data,
  };
});

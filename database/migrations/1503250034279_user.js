'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  async up () {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    this.create('users', (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw('uuid_generate_v4()'))
      table.string('name', 80).notNullable()
      table.string('username', 80).notNullable().unique()
      table.string('email').notNullable().unique()
      table.string('avatar').defaultTo('https://api.adorable.io/avatars/285/abott@adorable.png')
      table.string('bio')
      table.string('instagram')
      table.string('facebook')
      table.string('github')
      table.string('linkedin')
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema

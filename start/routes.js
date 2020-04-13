'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/login', 'SessionController.login')

Route.post('/users', 'UserController.store')

Route.get('/users/:id', 'UserController.show').middleware('auth')

Route.put('/users/:id', 'UserController.update').middleware('auth')

Route.delete('/users/:id', 'UserController.destroy').middleware('auth')

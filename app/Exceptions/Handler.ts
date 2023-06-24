/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected statusPages = {
    '403': 'pages/errors/403',
    '404': 'pages/errors/404',
    '500..599': 'pages/errors/5XX',
  }

  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    if (error.code === 'E_VALIDATION_FAILURE') {
      ctx.up.setTarget(ctx.up.getFailTarget())
      ctx.up.setMode(ctx.up.getFailMode())
      ctx.up.setContext('{ "E_VALIDATION_FAILURE": true }')
    }

    if (!error.status || this.expandedStatusPages[error.status]) {
      ctx.up.fullReload()
    }

    return super.handle(error, ctx)
  }
}

import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)

    const accessToken = await User.accessTokens.create(user)

    return response.ok({
      user,
      accessToken: accessToken.value!.release(),
    })
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.ok({ message: 'Logged out successfully' })
  }

  async register({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'full_name',
        'email',
        'password',
        'bio',
        'avatar_url',
        'weekly_time_goal',
        'yearly_number_goal',
      ])
      const user = await User.create(data)
      user.save()
      const token = await User.accessTokens.create(user)

      return response.created({
        user,
        token: token.value!.release(),
      })
    } catch (error) {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }
}
// Todo: implement refresh token logic / forgot password

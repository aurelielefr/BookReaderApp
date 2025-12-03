import { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async me({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      return response.ok(user)
    } catch (error) {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }

  async update({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      const data = request.only([
        'fullName',
        'email',
        'bio',
        'avatarUrl',
        'weeklyTimeGoal',
        'yearlyNumberGoal',
      ])
      user.merge(data)
      await user.save()
      return response.ok(user)
    } catch (error) {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }

  async delete({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      await user!.delete()
      return response.ok({ message: 'User deleted successfully' })
    } catch (error) {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }
}

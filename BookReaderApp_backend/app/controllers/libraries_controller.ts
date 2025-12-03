import type { HttpContext } from '@adonisjs/core/http'

import Library from '#models/library'

export default class LibrariesController {
  async addBookToLibrary({ auth, request, response }: HttpContext) {
    try {
      const userId = auth.user!.id
      const { bookId } = request.only(['bookId'])
      const libraryEntry = await Library.create({ userId, bookId })
      return response.created(libraryEntry)
    } catch (error) {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }

  async destroy({ auth, params, response }: HttpContext) {
    try {
      const userId = auth.user!.id
      const bookId = params.bookId

      const entry = await Library.query().where('userId', userId).where('bookId', bookId).first()
      if (!entry) return response.notFound({ message: 'Not in your library' })
      await entry.delete()

      return response.ok({ message: 'Library entry deleted successfully' })
    } catch (error) {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const profileId = params.id
      const libraryEntry = await Library.findOrFail(profileId)
      return response.ok(libraryEntry)
    } catch (error) {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }

  async getAllGenders({ response }: HttpContext) {
    try {
      const genders = await Library.query().distinct('genre')
      return genders
    } catch (error) {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }

  async searchBooksInLibrary({ params, response }: HttpContext) {
    try {
      const searchTerm = params.term
      const books = await Library.query()
        .where('title', 'like', `%${searchTerm}%`)
        .orWhere('author', 'like', `%${searchTerm}%`)
      return response.ok(books)
    } catch (error) {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }

  async upsertRating({ auth, params, request, response }: HttpContext) {
    try {
      const userId = auth.user!.id
      const bookId = params.bookId

      const { rating, review } = request.only(['rating', 'review'])
      let entry = await Library.query().where('userId', userId).andWhere('bookId', bookId).first()

      if (!entry) {
        entry = await Library.create({
          userId,
          bookId,
          rating,
          review,
        })
      } else {
        entry.merge({ rating, review })
        await entry.save()
      }

      return response.ok(entry)
    } catch (error) {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }

  async deleteRating({ auth, params, response }: HttpContext) {
    try {
      const userId = auth.user!.id
      const bookId = params.bookId

      const entry = await Library.query().where('userId', userId).andWhere('bookId', bookId).first()

      if (!entry) {
        return response.notFound({ message: "You haven't rated this book" })
      }

      entry.merge({ rating: null, review: null })
      await entry.save()

      return response.ok({ message: 'Rating deleted' })
    } catch (error) {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }
}

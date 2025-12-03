import type { HttpContext } from '@adonisjs/core/http'

import Book from '#models/book'
import Library from '#models/library'

export default class BooksController {
  async getBookDetails({ params, response }: HttpContext) {
    try {
      const bookId = params.bookId
      const book = await Book.findOrFail(bookId)
      return response.ok(book)
    } catch (error) {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }

  async createBook({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'title',
        'author',
        'isbn',
        'description',
        'previewUrl',
        'bookUrl',
        'publishedYear',
        'genre',
      ])
      const book = await Book.create(data)
      return response.created(book)
    } catch (error) {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }

  async getRatings({ params, response }: HttpContext) {
    try {
      const bookId = params.bookId

      const entries = await Library.query().where('bookId', bookId)

      if (entries.length === 0) {
        return response.ok({
          bookId,
          averageRating: 0,
          ratingsCount: 0,
          reviews: [],
        })
      }

      const ratings = entries.map((e) => e.rating).filter(Boolean) as number[]

      const average = ratings.reduce((a, b) => a + b, 0) / ratings.length

      return response.ok({
        bookId,
        averageRating: average,
        ratingsCount: ratings.length,
        reviews: entries.map((e) => ({
          userId: e.userId,
          rating: e.rating,
          review: e.review,
        })),
      })
    } catch {
      return response.internalServerError({ message: 'Internal server error' })
    }
  }
}

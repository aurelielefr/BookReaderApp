import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'books'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.string('author').notNullable()
      table.string('isbn').notNullable()
      table.text('description').notNullable()
      table.string('preview_url').notNullable()
      table.string('book_url').notNullable()
      table.integer('published_year').notNullable()
      table.string('genre').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

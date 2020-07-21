const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
require('express-async-errors')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const { blogToRemove } = require('./test_helper')



beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.blogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('api test:', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned ', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.blogs.length)
  })

  test('blog retrieved from db has an id property', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('POST route creates a new blog post', async () => {
    const newBlog = {
      title: 'this is a blog for sure',
      author: 'Gerald',
      url: 'https://twitter.com',
      likes: 41
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'this is a blog for sure'
    )

  })

  test('Blog without likes defaults to zero likes', async () => {
    const likelessBlog = {
      title: 'This blog has no likes in the request!',
      author: 'Christina',
      url: 'https://google.com'
    }

    await api
      .post('/api/blogs')
      .send(likelessBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const retreivedBlog = await Blog.findOne({ author: 'Christina' })
    expect(retreivedBlog.likes).toBe(0)

  })

  test('Blog cannot be added without a title and URL', async () => {
    const newBlog = {
      author: 'Freddie',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.blogs.length)

  })

  test('A blog can be deleted', async () => {
    const blog = await helper.blogToRemove()
    await api
      .delete(`/api/blogs/${blog.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)

    expect(titles).not.toContain(blogToRemove.title)


  })

  test('A blog can be updated', async () => {
    const blog = await helper.blogToRemove()
    const likesBefore = blog.likes

    const updatedBlog = await api
      .put(`/api/blogs/${blog.id}`)
      .send({ ...blog, likes: 37 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(updatedBlog.body.likes).not.toEqual(likesBefore)
    expect(updatedBlog.body.likes).toEqual(37)


  })
})

afterAll(() => {
  mongoose.connection.close()
})
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {
  //TODO refactor so this code isn't redundant
  const token = request.token
  const blog = await Blog.findById(request.params.id)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const userid = await (await User.findById(decodedToken.id))._id

  if (!blog) {
    return response.status(401).json({ error: 'blog not found' })
  } else if (!userid || !blog.user) {
    return response.status(401).json({ error: 'you do not have permission to delete this blog' })
  }

  if (blog.user.toString() === userid.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'you do not have permission to delete this blog' })
  }



})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    likes: body.likes || 0
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)

})

module.exports = blogsRouter
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  console.log('has not crashed yet :)')
  console.log(request.params.id, 'is id')
  const blogToUpdate = await Blog
    .findById(request.params.id)



  blogToUpdate.comments = blogToUpdate.comments.concat(body.comments)


  console.log('new blog is ', blogToUpdate)
  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blogToUpdate, { new: true })
  response.json(updatedBlog)

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
  console.log('blog being created is ', savedBlog)

  response.json(savedBlog)

})



blogsRouter.delete('/:id', async (request, response) => {

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  console.log('body in update is', body)
  //const userId = body.user.id ? body.user.id : body.user
  const blog = {

    user: body.user,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })
  console.log('body in update after saved is', body)
  response.json(updatedBlog)

})



module.exports = blogsRouter
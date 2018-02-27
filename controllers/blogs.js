const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Blogcomment = require('../models/blogcomment')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, adult: 1 })
    .populate('blogcomments', { content: 1 })
  
  response.json(blogs.map(Blog.format))
})

blogsRouter.get('/:id', async (request, response) => {
    try {
      const blog = await Blog.findById(request.params.id)
        .populate('blogcomments', { content: 1 })

      if (blog) {
        response.json(Blog.format(blog))
      } else {
        response.status(404).end()
      }
  
    } catch (exception) {
      console.log(exception)
      response.status(400).send({ error: 'malformatted id' })
    }
  })

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  try {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)

      if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }

      if (body.title === undefined) {
        return response.status(400).json({ error: 'title  missing' })
      }

      if (body.author === undefined) {
        return response.status(400).json({ error: 'author  missing' })
      }

      if (body.url === undefined) {
        return response.status(400).json({ error: 'url  missing' })
      }

      const user = await User.findById(decodedToken.id)      

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id,
        blogcomments: []
      })

      if (body.likes === undefined) {
          blog.likes = 0;
      }
  
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()

      response.json(Blog.format(blog))
  } catch (exception) {
      if (exception.name === 'JsonWebTokenError' ) {
        response.status(401).json({ error: exception.message })
      } else {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
      }
  }
})  

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  const blog = await Blog.findById(body.id)      

  try {      
      const blogcomment = new Blogcomment({
        content: body.content,
        blog: blog._id
      })
  
      const savedBlogcomment = await blogcomment.save()
      blog.blogcomments = blog.blogcomments.concat(savedBlogcomment._id)
      await blog.save()

      response.json(Blog.format(blog))
  } catch (exception) {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
      
  }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)

      if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }
      const blog = await Blog.findById(request.params.id)  
    
      if (blog.user === undefined || blog.user.toString() === decodedToken.id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
      } else {
        return response.status(401).json({ error: 'only person who has added the blog can remove it' })     
      }

      response.status(204).end()
    }  catch (exception) {
      if (exception.name === 'JsonWebTokenError' ) {
        response.status(401).json({ error: exception.message })
      } else {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
      }
  }
})

blogsRouter.put('/:id', async (request, response) => {
    try {
        const body = request.body
        const blog = {
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            blogcomments: body.blogcomments
        }

        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
          .populate('blogcomments', { content: 1 })
          
        response.json(Blog.format(updatedBlog))
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })       
    }
  })

module.exports = blogsRouter

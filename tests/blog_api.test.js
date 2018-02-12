const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')

describe('addition of a new blog', async () => {

    test('POST /api/blogs succeeds with valid data', async () => {
      const blogsAtStart = await blogsInDb()

      const newBlog = {
        title: 'test title',
        author: 'saatana',
        url: 'fsdfsdfdsfsdfdsfdsfdsfs',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

      const title = blogsAfterOperation.map(r => r.title)
      expect(title).toContainEqual('test title')
    })

    test('POST /api/blogs fails with proper statuscode if title is missing', async () => {
      const newBlog = {
        author: 'saatana',
        url: 'fsdfsdfdsfsdfdsfdsfdsfs',
        likes: 2
      }

      const blogsAtStart = await blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAfterOperation = await blogsInDb()

      const title = blogsAfterOperation.map(r => r.title)

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })

    test('POST /api/blogs fails with proper statuscode if author is missing', async () => {
        const newBlog = {
          title: 'test title',
          url: 'fsdfsdfdsfsdfdsfdsfdsfs',
          likes: 2
        }
  
        const blogsAtStart = await blogsInDb()
  
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
  
        const blogsAfterOperation = await blogsInDb()
  
        const author = blogsAfterOperation.map(r => r.author)
  
        expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
      })

      test('POST /api/blogs fails with proper statuscode if url is missing', async () => {
        const newBlog = {
          title: 'test title',
          author: 'saatana',
          likes: 2
        }
  
        const blogsAtStart = await blogsInDb()
  
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
  
        const blogsAfterOperation = await blogsInDb()
  
        const url = blogsAfterOperation.map(r => r.url)
  
        expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
      })

      test('POST /api/blogs sets likes to 0  if likes are missing', async () => {
        const newBlog = {
          title: 'test title',
          author: 'saatana',
          url: 'fsdfsdfdsfsdfdsfdsfdsfs',
        }
  
        const blogsAtStart = await blogsInDb()
  
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(200)
  
        const blogsAfterOperation = await blogsInDb()
  
        const likes = blogsAfterOperation.map(r => r.likes)

        expect(likes[likes.length - 1]).toBe(0)  
        expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
      })
})

describe('updating of an existing blog', async () => {

    test('PUT /api/blogs succeeds with valid data', async () => {
      const blogsAtStart = await blogsInDb()

      let updatedBlog = blogsAtStart[0]
      updatedBlog.likes = 666

      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()

      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)

      const likes = blogsAfterOperation.map(r => r.likes)
      expect(likes[0]).toBe(666) 
    })
})


describe('when there is initially some blogs saved', async () => {
    beforeAll(async () => {
        await Blog.remove({})
    
        const blogObjects = initialBlogs.map(b => new Blog(b))
        await Promise.all(blogObjects.map(b => b.save()))
    })
    
    test('all blogs are returned as json by GET /api/blogs', async () => {
        const blogsInDatabase = await blogsInDb()
    
        const response = await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
    
        expect(response.body.length).toBe(blogsInDatabase.length)
        
        const returnedContents = response.body.map(n => n.title)
    
        blogsInDatabase.forEach(blog => {
          expect(returnedContents).toContainEqual(blog.title)
        })
      })
  
    test('individual blogs are returned as json by GET /api/blogs/:id', async () => {
        const blogsInDatabase = await blogsInDb()
        const aBlog = blogsInDatabase[0]

        console.log(aBlog.id)
  
        const response = await api
          .get(`/api/blogs/${aBlog.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
  
        expect(response.body.author).toBe(aBlog.author)
    })
  
    test('404 returned by GET /api/blogs/:id with nonexisting valid id', async () => {
      const validNonexistingId = await nonExistingId()
  
      const response = await api
        .get(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })
  
    test('400 is returned by GET /api/blogs/:id with invalid id', async () => {
      const invalidId = "5a3d5da59070081a82a3445"
  
      const response = await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
})

describe('deletion of a blog', async () => {
    let addedBlog

    beforeAll(async () => {
        addedBlog = new Blog({
        title: 'paskat',
        author: 'saatana',
        url: 'fsdfsdfdsfsdfdsfdsfdsfs',
        likes: 2
      })
      await addedBlog.save()
    })

    test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
      const blogsAtStart = await blogsInDb()

      await api
        .delete(`/api/blogs/${addedBlog._id}`)
        .expect(204)

      const blogsAfterOperation = await blogsInDb()

      const titles = blogsAfterOperation.map(r => r.title)

      expect(titles).not.toContain(addedBlog.title)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
    })
  })

afterAll(() => {
  server.close()
})
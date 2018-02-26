const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
  
usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const existingUser = await User.find({username: body.username})
    if (existingUser.length > 0) {
      return response.status(400).json({ error: 'username must be unique' })
    }

    if (body.password.length < 3) {
        return response.status(400).json({ error: 'password must at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      adult: body.adult
    })

    if (body.adult === undefined) {
        user.adult = true;
    }

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

const formatUser = (user) => {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      adult: user.adult,
      blogs: user.blogs
    }
}
  
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(users.map(User.format))
})

usersRouter.get('/:id', async (request, response) => {
  try {
    const user = await User.findById(request.params.id)
      .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })

    console.log(user)
    if (user) {
      response.json(User.format)
    } else {
      response.status(404).end()
    }

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = usersRouter
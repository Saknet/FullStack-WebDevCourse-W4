import React from 'react'
import { mount } from 'enzyme'
import App from './App'
import Blog from './components/Blog'
jest.mock('./services/blogs')
import blogService from './services/blogs'

describe('<App />', () => {
  let app
  beforeAll(() => {
    app = mount(<App />)
  })

  describe('when user is not logged', () => {
    beforeEach(() => {
      // luo sovellus siten, että käyttäjä ei ole kirjautuneena
    })

    it('only login form is rendered', () => {
        app.update()
        const blogComponents = app.find(Blog)
        expect(blogComponents.length).toEqual(0)
    })
  })

  describe('when user is logged', () => {
    beforeEach(() => {
        const user = {
            username: 'tester',
            token: '1231231214',
            name: 'Teuvo Testaaja'
          }
          
          localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
    })

    it('all blogs are rendered', () => {
        app.update()
        console.log(blogService.blogs.length)
        const blogComponents = app.find(Blog)
        expect(blogComponents.length).toEqual(blogService.blogs.length)
    })
  })
})
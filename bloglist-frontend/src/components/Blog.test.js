import React from 'react'
import { shallow } from 'enzyme'
import Blog from './Blog'

describe.only('<Blog />', () => {
  it('renders title, author and likes', () => {
    const blog = {
        title: 'testing is fun',
        author: 'test person',
        likes: 1,
        url: 'http://testurl.com',
        user: 'test user'
      }

    const mockHandler = jest.fn()
    const blogComponent = shallow(<Blog blog = {blog} blogUpdate = {mockHandler} blogDelete = {mockHandler} currentUser = 'test user'/>)
    const dataDiv = blogComponent.find('.info')

    expect(dataDiv.text()).toContain(blog.title)
    expect(dataDiv.text()).toContain(blog.author)
  })

  it('it shows likes, url, owner after click', () => {
    const user = {
        username: 'test user',
        name: 'test name'
    }
    const blog = {
      title: 'testing is fun',
      author: 'test person',
      likes: 1,
      url: 'http://testurl.com',
      user: user
    }
  
    const mockHandler = jest.fn()
    const blogComponent = shallow(<Blog blog = {blog} blogUpdate = {mockHandler} blogDelete = {mockHandler} currentUser = 'test user'/>)
    const dataDiv = blogComponent.find('.info')

    expect(dataDiv.text()).toContain(blog.title)
    expect(dataDiv.text()).toContain(blog.author)

    dataDiv.simulate('click')

    const urlDiv = blogComponent.find('.url')
    expect(urlDiv.text()).toContain(blog.url)
    const likeDiv = blogComponent.find('.likes')
    expect(likeDiv.text()).toContain(blog.likes)
    const userDiv = blogComponent.find('.user')
    expect(userDiv.text()).toContain(blog.user.username)
  })    
})
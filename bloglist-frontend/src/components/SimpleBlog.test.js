import React from 'react'
import { shallow } from 'enzyme'
import SimpleBlog from './SimpleBlog'

describe.only('<SimpleBlog />', () => {
  it('renders title, author and likes', () => {
    const blog = {
      title: 'testing is fun',
      author: 'test person',
      likes: 1
    }

    const blogComponent = shallow(<SimpleBlog blog = {blog} />)
    const dataDiv = blogComponent.find('.data')

    expect(dataDiv.text()).toContain(blog.title)
    expect(dataDiv.text()).toContain(blog.author)

    const likeDiv = blogComponent.find('.likes')

    expect(likeDiv.text()).toContain(blog.likes)
  })
})
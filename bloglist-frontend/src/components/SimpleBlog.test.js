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

  it('clicking the button calls event handler twidce', () => {
    const blog = {
      title: 'testing is fun',
      author: 'test person',
      likes: 1
    }
  
    const mockHandler = jest.fn()
  
    const blogComponent = shallow(<SimpleBlog blog = {blog} onClick = {mockHandler}/>)
  
    const button = blogComponent.find('button')

    button.simulate('click')
    button.simulate('click')
  
    expect(mockHandler.mock.calls.length).toBe(2)
  })    
})
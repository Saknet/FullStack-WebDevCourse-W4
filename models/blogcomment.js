const mongoose = require('mongoose')

  const blogcommentSchema = new mongoose.Schema({
    content: String,
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
  })
  
  blogcommentSchema.statics.format = (blogcomment) => {
    return {
      id: blogcomment._id,
      content: blogcomment.content,
      blog: blogcomment.blog
    }
  }
  
  const Blogcomment = mongoose.model('Blogcomment', blogcommentSchema)
  
  module.exports = Blogcomment
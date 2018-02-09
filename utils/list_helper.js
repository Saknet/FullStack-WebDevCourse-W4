const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let count = 0;
    for (let i = 0; i < blogs.length; i++) {
        count += blogs[i].likes;
    }

    return count;
}

const favoriteBlog = (blogs) => {
    let blog = blogs[0]

    for (let i = 1; i < blogs.length; i++) {
        if (blogs[i].likes > blog.likes) {
            blog = blogs[i]
        }
    }

    return blog;
}

const mostBlogs = (blogs) => {
    let authorAndBlogs = []

    for (let i = 0; i < blogs.length; i++) {
        if (authorAndBlogs.filter(a => a.author === blogs[i].author).length > 0) {
            for (let j = 0; j < authorAndBlogs.length; j++) {
                if (authorAndBlogs[j].author === blogs[i].author) {
                    let current = authorAndBlogs[j].blogs;
                    current++;
                    authorAndBlogs[j].blogs = current;
                }
            }
        } else {
            const blogger = {
                author: blogs[i].author,
                blogs: 1
            }
            authorAndBlogs.push(blogger)
        }
    }

    let mostBlogs = authorAndBlogs[0]

    for (let i = 1; i < authorAndBlogs.length; i++) {
        if (mostBlogs.blogs < authorAndBlogs[i].blogs) {
            mostBlogs = authorAndBlogs[i];
        }
    }
    return mostBlogs;
}

const mostLikes = (blogs) => {
    let authorAndLikes = []

    for (let i = 0; i < blogs.length; i++) {
        if (authorAndLikes.filter(a => a.author === blogs[i].author).length > 0) {
            for (let j = 0; j < authorAndLikes.length; j++) {
                if (authorAndLikes[j].author === blogs[i].author) {
                    let currentLikes = authorAndLikes[j].votes;
                    let newLikes = currentLikes + blogs[i].likes;
                    authorAndLikes[j].votes = newLikes;
                }
            }
        } else {
            const blogger = {
                author: blogs[i].author,
                votes: blogs[i].likes
            }
            authorAndLikes.push(blogger)
        }
    }

    let mostLikes = authorAndLikes[0]

    for (let i = 1; i < authorAndLikes.length; i++) {
        if (mostLikes.votes < authorAndLikes[i].votes) {
            mostLikes = authorAndLikes[i];
        }
    }
    return mostLikes;
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
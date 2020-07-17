
// eslint-disable-next-line no-unused-vars
const dummy = (_blogs) => 1

const totalLikes = (blogs) => {

  const reducer = (sum, { likes }) => sum + likes
  const sum = blogs.reduce(reducer, 0)

  return sum
}

const favoriteBlog = (blogs) => {
  const reducer = (max, blog) => {
    max = blog.likes > max.likes ? blog : max
    return max
  }
  const fav = blogs.reduce(reducer, { likes: 0 })
  return {
    title: fav.title,
    author: fav.author,
    likes: fav.likes
  }
}
//returns the author with the most blogs (and how many blogs they have)
const groupByAuthor = (blogs) => {
  return blogs.reduce((arr, blog) => {
    const author = blog.author
    if (!arr[author]) {
      arr[author] = []
    }
    arr[author].push(blog)
    return arr

  }, [])
}

const mostLikes = (blogs) => {
  const blogsByAuthor = groupByAuthor(blogs)

  const reducer = (max, author) => {
    const numLikes = blogsByAuthor[author].reduce((totalLikes, { likes }) => {
      return totalLikes + likes
    }, 0)
    max = numLikes > max.likes ? { likes: numLikes, author: author } : max
    return max
  }

  const authors = Object.keys(blogsByAuthor)
  let mostLikes = authors.reduce(reducer, { likes: 0 })

  return mostLikes

}



const mostBlogs = (blogs) => {

  //first step group by authors

  const blogsByAuthor = groupByAuthor(blogs)
  /* REFACTORED BUT SAVED FOR POSTERITY
  //REFACTOR THIS
  let max = 0
  let maxAuthor = ''
  for (const author in blogsByAuthor) {
    let curLen = blogsByAuthor[author].length
    if (curLen > max) {
      max = curLen
      maxAuthor = author
    }
  }
 */
  const reducer = (max, author) => {
    const numBlogs = blogsByAuthor[author].length
    console.log(numBlogs, author)
    max = numBlogs > max.blogs ? { blogs: numBlogs, author: author } : max
    return max
  }
  const authors = Object.keys(blogsByAuthor)

  let maxBlogs = authors.reduce(reducer, { blogs: 0 })

  return maxBlogs


}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
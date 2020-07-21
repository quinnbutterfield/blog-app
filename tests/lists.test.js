const listHelper = require('./list_helper')
const blogHolder = require('./test_helper')
const blogs = blogHolder.blogs





test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})




describe('total likes', () => {

  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })
  test('of large list is correct', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36)
  })
  test('when list has only one blog', () => {
    const result = listHelper.totalLikes([blogs[1]])
    expect(result).toBe(5)
  })
})

describe('favorite blog', () => {
  test('of large list is correct', () => {
    expect(listHelper.favoriteBlog(blogs)).toEqual(
      { 'author': 'Edsger W. Dijkstra', 'title': 'Canonical string reduction', 'likes': 12 }
    )
  })
})

describe('most prolific author', () => {
  test('of large list is correct', () => {
    expect(listHelper.mostBlogs(blogs)).toEqual(
      { 'author': 'Robert C. Martin', 'blogs': 3 }
    )
  })
})

describe('author with most likes on their blogs', () => {
  test('of large list is correct', () => {
    expect(listHelper.mostLikes(blogs)).toEqual(
      { 'author': 'Edsger W. Dijkstra', 'likes': 17 }
    )
  })
})



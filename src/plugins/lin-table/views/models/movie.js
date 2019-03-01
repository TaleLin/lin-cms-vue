import { movieList } from '../../mock'

class Movie {
  getTop250(start = 0, count = 20) {
    const arr = []
    const tempList = movieList.slice()
    const currentList = tempList.splice(start, count)
    currentList.forEach((element, index) => {
      const tempCasts = []
      const tempDirectors = []
      element.casts.forEach((el) => {
        tempCasts.push(el.name)
      })
      element.directors.forEach((el) => {
        tempDirectors.push(el.name)
      })

      arr.push({
        title: element.title,
        originalTitle: element.original_title,
        year: element.year,
        rating: element.rating.average,
        casts: tempCasts.join('/'),
        directors: tempDirectors.join('/'),
        genres: element.genres.join('/'),
        rank: index + 1 + start,
        sorting: 50,
        recommend: 0,
      })
    })

    return arr
  }
}

export default new Movie()

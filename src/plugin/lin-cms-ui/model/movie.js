import { movieList } from '../simulation/movie'

class Movie {
  getTop250(start = 0, count = 20) {
    const arr = []
    const tempList = movieList.slice()
    const currentList = tempList.splice(start, count)
    currentList.forEach((element, index) => {
      const tempCasts = []
      const tempDirectors = []
      element.casts.forEach(el => {
        tempCasts.push(el.name)
      })
      element.directors.forEach(el => {
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
        remark: '这是一部不错的电影',
        editFlag: false,
        thumb: element.thumb
          ? element.thumb
          : 'https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/270-400.png',
      })
    })

    return arr
  }

  getDataByQuery(query = '') {
    const arr = []
    for (let index = 0; index < movieList.length; index++) {
      const element = movieList[index]

      if (element.title.match(query)) {
        const tempCasts = []
        const tempDirectors = []
        element.casts.forEach(el => {
          tempCasts.push(el.name)
        })
        element.directors.forEach(el => {
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
          rank: index + 1,
          sorting: 50,
          recommend: 0,
          remark: '这是一部不错的电影',
          editFlag: false,
          thumb: element.thumb
            ? element.thumb
            : 'https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/270-400.png',
        })
      }
    }

    return arr
  }
}

export default new Movie()

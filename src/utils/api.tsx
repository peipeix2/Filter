const api = {
    HOSTNAME: 'https://api.themoviedb.org/3',
    API_KEY: '937809fa4831d8654e52f894f9f8da84',

    async getMovies(status:string) {
      const response = await fetch(
          `${this.HOSTNAME}/movie/${status}?language=zh-TW&api_key=${this.API_KEY}`
      )
      return await response.json()
    }
}

export default api
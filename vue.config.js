module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: process.env.API_SERVER
  }
}
import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3334' })

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(async ( { app } ) => {
  // something to do
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})


export { api }
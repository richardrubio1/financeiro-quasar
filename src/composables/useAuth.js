import { ref } from 'vue'
import api from 'src/services/api'

const user = ref(null)
const token = ref(localStorage.getItem('token') || '')

if (token.value) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
}

export function useAuth() {
  const login = async (credentials) => {
    const { data } = await api.post('/login', credentials)
    token.value = data.token.token
    user.value = data.user
    localStorage.setItem('token', token.value)
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  const logout = async () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  return { user, token, login, logout }
}

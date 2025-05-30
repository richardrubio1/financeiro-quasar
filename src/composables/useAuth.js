import { ref } from 'vue'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

const user = ref(null)
const token = ref(localStorage.getItem('token') || '')
const router = useRouter()

if (token.value) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
}

export function useAuth() {
  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials)
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', token.value)
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      router.push('/')
    } catch (error) {
      throw new Error('Credenciais inválidas')
    }
  }

  const logout = async () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    router.push('/login')
  }

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData)
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', token.value)
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      router.push('/')
    } catch (error) {
      throw new Error('Erro ao registrar usuário')
    }
  }

  return {
    user,
    token,
    login,
    logout,
    register,
    isAuthenticated: () => !!token.value
  }
}
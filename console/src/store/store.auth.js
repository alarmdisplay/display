import { makeAuthPlugin } from '@/feathers-client'

function getExpiresAt (state) {
  const expiresAt = state.payload?.authentication?.payload?.exp
  if (!expiresAt) {
    return false
  }

  return expiresAt
}

export default makeAuthPlugin({ userService: 'users', entityIdField: 'id', getters: { expiresAt: getExpiresAt } })

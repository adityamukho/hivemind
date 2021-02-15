const mapUserData =  async user => user ? {
  id: user.uid,
  email: user.email,
  token: await user.getIdToken()
} : null

export const mapCachedUserData = user => user ? {
  id: user.uid,
  email: user.email,
  token: user.xa
} : null

export default mapUserData
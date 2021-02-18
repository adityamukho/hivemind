const mapUserData =  async user => user ? {
  id: user.uid,
  email: user.email,
  token: await user.getIdToken()
} : null

export default mapUserData
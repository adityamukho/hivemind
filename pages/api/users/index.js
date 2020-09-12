import { aql } from 'arangojs'
import { pick } from 'lodash'
import db from '../../../utils/arangoWrapper'
import { verifyIdToken } from '../../../utils/auth/firebaseAdmin'

const saveUser = async (req, res) => {
  const { token } = req.headers

  try {
    const claims = await verifyIdToken(token)
    const user = pick(claims, 'email', 'email_verified', 'name', 'picture')
    const key = claims.uid
    user._key = key

    switch (req.method) {
      case 'POST':
        const query = aql`
          upsert { _key: ${key} }
          insert ${user}
          replace ${user} in users
        `
        await db.query(query)

        return res.status(200).json({ message: 'User updated.' })
    }
  }
  catch (error) {
    console.error(error.message, error.stack)
    return res.status(401).json({ message: 'Access Denied.' })
  }
}

export default saveUser

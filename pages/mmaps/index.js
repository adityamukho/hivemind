import AuthPrompt from '../../components/auth/AuthPrompt'
import MindMaps from '../../components/mindmap/MindMaps'
import { useUser } from '../../utils/auth/useUser'

const MMaps = () => {
  const { user } = useUser()

  if (!user) {
    return <AuthPrompt/>
  }

  return <MindMaps/>
}

export default MMaps
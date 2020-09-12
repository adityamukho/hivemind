const { get } = require('lodash')

const MindMap = ({ data, setTitle }) => {
  const name = get(data, [0, 'v', 'name'])
  if (name) {
    setTitle(name)
  }

  return JSON.stringify(data)
}

export default MindMap
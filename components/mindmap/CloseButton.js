import React from 'react'
import { X } from 'react-feather'
import { CardLink } from 'reactstrap'
import { removePopper } from '../../utils/cyHelpers'

const closeButton = ({ popperKey, divKey, poppers }) => (
  <CardLink
    href="#"
    className="btn btn-outline-dark float-right align-bottom ml-1"
    onClick={() => removePopper(popperKey, divKey, poppers)}
  >
    <X/>
  </CardLink>
)

export default closeButton
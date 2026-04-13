import React from 'react'
import { Button, Data } from '../styles/Userpromote.styles'

const Card = ({data}) => {
  return (
    <>
        <Data>
            <h2>{data.role}</h2>
            <h2>{data.username}</h2>

            <Button type="submit">submit</Button>
        </Data>
    </>
  )
}

export default Card
import React, { useState } from 'react'
import Header from '../component/Header'
import { Container } from '../styles/Userpromote.styles'
import Card from '../component/Card'

const UserPromote = ({alluser}) => {
  
 const listofuser=alluser
  return (
    <>
        <Header/>
        <Container>
            {
               alluser.map((user,id)=>{
                return(
                    <Card data={user} key={id}/>
                )
               })
            }
        </Container>

    </>
  )
}

export default UserPromote
import React from 'react'

const MultiChoice = ({item}) => {
    const [next,setNext]=useState(false)
     const [answer,setAnswer]=useState("")
        const handleChange=(e)=>{
           setAnswer(e.target.value)
            setNext(true)
        }
  return (
    <>
        

    </>
  )
}

export default MultiChoice
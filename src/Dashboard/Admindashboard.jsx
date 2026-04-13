// import React, { useEffect, useState } from 'react'
// import { Container, Option, Select } from '../styles/CreateExam.style'


// const Admindashboard = () => {
//   let[examName,setExamName]=useState([])
  
//   let getAllId=async ()=>{
//     let response=await fetch("https://localhost:8443/sphinx/api/exam/getexamname",{
//       method:"GET",
//       headers:{
//         "Content-Type": "application/json",
//       }
      

//     })
//     let data1=await response.json()
//     setExamName(data1. data);

//   }
//   return (
//     <>
//       <Container>
//         <Select onClick={getAllId}>
//           {
//             examName.map((data,i)=>{
//               return(
//                 <Option key={i} >{data}</Option>
//               )
              
//             })
//           }
//         </Select>
//       </Container>
//     </>
//   )
// }

// export default Admindashboard
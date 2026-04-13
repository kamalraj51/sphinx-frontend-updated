import styled from "styled-components";

export const EditExContainer=styled.div`


`

export const Heading=styled.h2`
margin:10px 0px; 



`

export const TopicContaienEx=styled.div`
display:flex;
justify-content:space-between;
padding:10px 15px;
border-top-right-radius: 10px;
border-bottom-left-radius: 10px;
background-color:${({ theme }) => theme.colors.primary};
margin-bottom:10px;

`

export const TopicName=styled.h3`
color:${({ theme }) => theme.colors.surface};
font-size:24px;
padding:10px;
`

export const Buttons=styled.div`
padding:10px;
display:flex;
gap:10px;
`

export const Button=styled.button`
padding:10px;
`


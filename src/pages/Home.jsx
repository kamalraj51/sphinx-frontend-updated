import React from 'react'
import Layout from '../component/Layout'

import AvailableExam from '../component/AvailableExam'
import Header from '../component/Header'
import Userdashboard from '../Dashboard/Userdashboard'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate=useNavigate()
   const {  role } = useSelector((state) => state.auth);
    if (role && role !== "SPX_ADMIN") {
      navigate("/userdashboard");
    }
  

  console.log("done");
  return (
    <Layout>
      <AvailableExam />
    </Layout>
  );
};

export default Home;

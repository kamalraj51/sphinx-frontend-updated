import React, { useState, useEffect } from "react";
import { toggle } from "../reducer/apiReduce";
import {
  Button,
  Container,
  Field,
  Form,
  Input,
  Label,
  Row,
  Select,
} from "../styles/CreateExam.style";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ExamTDetails from "./ExamTDetails";

const ExamTopic = () => {
  const [topics, setTopics] = useState([]);
   const { examId } = useParams();
   console.log(examId)
 const [loading,setLoading]=useState(false)
  const dispatch=useDispatch()
  let [data, setData] = useState({
    examTopicName: "",
    topicId: "",
    examId: examId,
    topicPassPercentage: "",
  });


  let handleinput = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };


  let handledata = async (e) => {
   e.preventDefault();
   console.log(examId+ 'inside api call')
   setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500));
   
   try{
     let response = await fetch(
      "https://localhost:8443/sphinx/api/exam/examtopicdetails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    if (response.ok) {

      console.log("done poat ")
      dispatch(toggle())
    }
   }catch(err){
    console.log("catch :topic add ", err )
   }finally{
    setLoading(false)
   }
  };

  //api call
  useEffect(() => {
    const fetchTopics = async () => {
      console.log(data.topicId)
      try {
        const res = await fetch(
          "https://localhost:8443/sphinx/api/topic/gettopics",
        ); //id, name
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log(data);
        setTopics(data.topic || []); 
      } catch (err) {
        console.error("Error fetching topics:", err);
        console.log(err);
      }
    };

    fetchTopics();
  }, []);

  return (
    <>
    <Container>
       <Form onSubmit={handledata}>
        <Field>
          <Label>Select Topic</Label>
          <Select  name="topicId" value={data.topicId} onChange={handleinput}>
            <option value="">-- Select Topic --</option>
            {topics.map((topic) => (
              <option key={topic.topicId} value={topic.topicId}>
                {topic.topicName}
              </option>
            ))}
          </Select>
        </Field>

        <Field>
          <Label for="topicPassPercentage">percentage</Label>
          <Input type="text" name="topicPassPercentage" value={data.topicPassPercentage} onChange={handleinput}></Input>
        </Field>

        <Button type="submit" disabled={loading}>{loading?"submitting":"add topic"}</Button>
      </Form>
     
    </Container>
     <ExamTDetails examId={examId}></ExamTDetails>
     
    </>
  );
};

export default ExamTopic;

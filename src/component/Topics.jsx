import React, { useEffect, useState } from 'react'
import { Button, Buttons, H1, TopicContainer, TopicContent, TopicHeading, TopicName } from '../styles/TopicsStyle'
import { useDispatch, useSelector } from 'react-redux';
import { toggle } from '../reducer/apiReduce';
import { toast } from 'sonner';
import { EditIcon, RefreshCw, Trash2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import Pagination from './Pagination';
import styled from 'styled-components';
import {
    ContentQues,
    Para,
} from "../styles/ExamTDetails.style";
import { Edit } from '../styles/AvailableExamStyle';
import UpdateModal from './UpdateModal';

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const SelectWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors?.textPrimary || '#333'};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors?.error || '#e3342f'};
`;

const Topics = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);
      const userId = useSelector((state) => state.auth.user);
    const dispatch = useDispatch()
    const apiRefresh = useSelector((state) => state.api.value);

    // Pagination & Modal & Selection states
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); // 'bulk' or id
    const [updateModel,setUpdateModal]=useState(false)
    const[updateDetails,setUpdateDetails]=useState(null)
    
    const handleOpenModal = (id, name) => {
     setUpdateModal(true)
    setUpdateDetails({ topicId: id, topicName: name });
};
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await fetch(`https://localhost:8443/sphinx/api/topic/gettopics?userLoginId=${encodeURIComponent(userId)}`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setTopics(data.topic || []);
            } catch (err) {
                console.error("Error fetching topics:", err);
            }
        };
        fetchTopics();
    }, [apiRefresh]);

    const change = (e, id) => {
        const updatedTopics = topics.map((topic) =>
            topic.topicId === id ? { ...topic, topicName: e.target.value } : topic
        );
        setTopics(updatedTopics);
    };

    const handleDeleteClick = (identifier) => {
        setItemToDelete(identifier);
        setModalOpen(true);
    };

    const performDelete = async (topicId) => {
        try {
            const response = await fetch( `https://localhost:8443/sphinx/api/topic/deletetopic?topicId=${encodeURIComponent(topicId)}&userLoginId=${encodeURIComponent(userId)}`
, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete topic");

        } catch (err) {
            console.log(err)
        } finally {
            dispatch(toggle());
        }
    };

    const executeDelete = async () => {
        setModalOpen(false);
        setLoading(true);

        try {
            if (itemToDelete === 'bulk') {
                for (const id of selectedIds) {
                    await performDelete(id);
                }
                toast.success("Selected topics deleted successfully");
                setSelectedIds([]);
            } else {
                await performDelete(itemToDelete);
                toast.success("Topic deleted successfully");
                setSelectedIds(prev => prev.filter(id => id !== itemToDelete));
            }

            // Adjust pagination if needed
            if (itemToDelete === 'bulk') {
                const remaining = topics.length - selectedIds.length;
                const newTotalPages = Math.ceil(remaining / 10);
                if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages);
            } else {
                if (paginatedTopics.length === 1 && currentPage > 1) setCurrentPage(prev => prev - 1);
            }


        } catch (err) {
            toast.error(err.message || "Failed to delete topic(s)");
        } finally {
            dispatch(toggle());
            setLoading(false);
        }
    };

    const updateTopic = async (topicId, topicName) => {
        let topic = { "topicId": topicId, "topicName": topicName,"userLoginId":userId };
        setLoading(true);

        try {
            const response = await fetch("https://localhost:8443/sphinx/api/topic/updatetopic", {
                method: "PUT",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify(topic)
            });
            if (!response.ok){
                throw new Error("not update");
                
            } 
           
            const data=response.json()
            toast.success(data.successMessage ||"Update successfully");
        } catch (err) {
            toast.error("Failed to update");
        } finally {
            dispatch(toggle());
            setLoading(false);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(paginatedTopics.map(t => t.topicId));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (e, topicId) => {
        if (e.target.checked) {
            setSelectedIds(prev => [...prev, topicId]);
        } else {
            setSelectedIds(prev => prev.filter(id => id !== topicId));
        }
    };

    const paginatedTopics = topics.slice((currentPage - 1) * 10, currentPage * 10);
    const allSelectedOnPage = paginatedTopics.length > 0 && paginatedTopics.every(t => selectedIds.includes(t.topicId));

    return (
        <TopicContainer>
            {/* <TopicHeading>Topics</TopicHeading> */}

            {topics.length > 0 && (
                <TopBar>
                    <SelectWrap>
                        <Checkbox
                            type="checkbox"
                            checked={allSelectedOnPage}
                            onChange={handleSelectAll}
                        />
                        <span>Select All</span>
                    </SelectWrap>
                    {selectedIds.length > 0 && (
                        <Button title="Delete Selected" style={{ backgroundColor: '#e3342f' }} disabled={loading} onClick={() => handleDeleteClick('bulk')}>
                            <Trash2 size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                            Delete Selected ({selectedIds.length})
                        </Button>
                    )}
                </TopBar>
            )}

            {topics.length === 0 ? <H1>No Topic Available</H1> : paginatedTopics.map((topic, index) => {
                const isSelected = selectedIds.includes(topic.topicId);
                return (
                    <ContentQues key={topic.topicId}>
                        <Checkbox
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectOne(e, topic.topicId)}
                            style={{ marginRight: '15px' }}
                        />
                        <Para style={{ width: '5%' }}>{(currentPage - 1) * 10 + index + 1}</Para>
                        <Para style={{ flex: 1, textAlign: 'left' }}>
                            <TopicName  >{topic.topicName}</TopicName>
                        </Para>
                        <Buttons style={{ width: '30%', justifyContent: 'flex-end', display: 'flex' }}>

                            <Edit
                                title="Edit Topic"
                                // onClick={() => updateTopic(topic.topicId, topic.topicName)}
                                onClick={ ()=>handleOpenModal(topic.topicId, topic.topicName)}

                                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <EditIcon size={16} />
                            </Edit>

                            <Button title="Delete Topic" disabled={loading} onClick={() => handleDeleteClick(topic.topicId)} style={{ backgroundColor: '#e3342f', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Trash2 size={16} /> {loading ? "..." : ""}
                            </Button>
                        </Buttons>
                    </ContentQues>
                    
                )
            })}
            <UpdateModal/>

            <Pagination
                currentPage={currentPage}
                totalItems={topics.length}
                itemsPerPage={10}
                onPageChange={(p) => setCurrentPage(p)}
            />

            <ConfirmModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={executeDelete}
                title={itemToDelete === 'bulk' ? "Bulk Delete Topics" : "Delete Topic"}
                message={itemToDelete === 'bulk' ? `Are you sure you want to delete ${selectedIds.length} topics?` : "Are you sure you want to delete this topic?"}
            />
            <UpdateModal
                isOpen={updateModel}    
                
                 onClose={() => setUpdateModal(false)}
                topics={updateDetails}    
                onUpdate={updateTopic}    
            />

        
        </TopicContainer>

      
    )
}

export default Topics

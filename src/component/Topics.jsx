import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../reducer/apiReduce";
import { toast } from "sonner";
import { EditIcon, Trash2 } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import Pagination from "./Pagination";
import UpdateModal from "./UpdateModal";
import styled, { keyframes } from "styled-components";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const Wrap = styled.div`
  font-family: "Sora", "DM Sans", "Segoe UI", sans-serif;
  animation: ${fadeUp} 0.45s ease both;
`;

const TableCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.1),
    0 1px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 20px;
`;

const StatsStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #fafbff;
  flex-wrap: wrap;
  gap: 10px;
`;

const StatItem = styled.div`
  font-size: 12.5px;
  color: #64748b;
  font-weight: 500;
  strong {
    color: #1e293b;
    font-weight: 800;
  }
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
  flex-wrap: wrap;
  gap: 10px;
`;

const SelectWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  font-weight: 600;
  color: #475569;
`;

const Checkbox = styled.input`
  width: 17px;
  height: 17px;
  cursor: pointer;
  accent-color: #10b981;
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 48px 52px 1fr 120px;
  padding: 13px 24px;
  background: #f0fdf4;
  border-bottom: 2px solid #d1fae5;
  align-items: center;
  gap: 10px;
`;

const HeadCell = styled.span`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #059669;
`;

const TopicRow = styled.div`
  display: grid;
  grid-template-columns: 48px 52px 1fr 120px;
  align-items: center;
  padding: 15px 24px;
  border-bottom: 1px solid #f1f5f9;
  gap: 10px;
  transition: background 0.18s ease;
  animation: ${slideIn} 0.3s ease both;
  animation-delay: ${({ $index }) => $index * 0.04}s;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f0fdf4;
  }
`;

const RowIndex = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
  text-align: center;
`;

const TopicInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TopicIconDot = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border: 1px solid #a7f3d0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 800;
`;

const TopicLabel = styled.span`
  font-size: 14.5px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  &:active {
    transform: scale(0.95);
  }
`;

const EditBtn = styled(IconBtn)`
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }
`;

const DeleteBtn = styled(IconBtn)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  box-shadow: 0 3px 10px rgba(239, 68, 68, 0.25);
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
  }
`;

const BulkDeleteBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s ease;
  box-shadow: 0 3px 10px rgba(239, 68, 68, 0.25);
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
  }
  &:active {
    transform: scale(0.97);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  padding: 64px 32px;
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  svg {
    opacity: 0.3;
  }
`;

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const apiRefresh = useSelector((state) => state.api.value);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [updateModel, setUpdateModal] = useState(false);
  const [updateDetails, setUpdateDetails] = useState(null);

  const handleOpenModal = (id, name) => {
    setUpdateModal(true);
    setUpdateDetails({ topicId: id, topicName: name });
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(
          `https://localhost:8443/sphinx/api/topic/gettopics?userLoginId=${encodeURIComponent(userId)}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
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
      const response = await fetch(
        `https://localhost:8443/sphinx/api/topic/deletetopic?topicId=${encodeURIComponent(topicId)}&userLoginId=${encodeURIComponent(userId)}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete topic");
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(toggle());
    }
  };

  const executeDelete = async () => {
    setModalOpen(false);
    setLoading(true);
    try {
      if (itemToDelete === "bulk") {
        for (const id of selectedIds) await performDelete(id);
        toast.success("Selected topics deleted successfully");
        setSelectedIds([]);
      } else {
        await performDelete(itemToDelete);
        toast.success("Topic deleted successfully");
        setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete));
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete topic(s)");
    } finally {
      dispatch(toggle());
      setLoading(false);
    }
  };

  const updateTopic = async (topicId, topicName) => {
    let topic = { topicId, topicName, userLoginId: userId };
    setLoading(true);
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/topic/updatetopic",
        {
          method: "PUT",
          headers: { "content-Type": "application/json" },
          body: JSON.stringify(topic)
        }
      );
      if (!response.ok) throw new Error("not update");
      const data = response.json();
      toast.success(data.successMessage || "Update successfully");
    } catch (err) {
      toast.error("Failed to update");
    } finally {
      dispatch(toggle());
      setLoading(false);
    }
  };

  const paginatedTopics = topics.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(paginatedTopics.map((t) => t.topicId));
    else setSelectedIds([]);
  };

  const handleSelectOne = (e, topicId) => {
    if (e.target.checked) setSelectedIds((prev) => [...prev, topicId]);
    else setSelectedIds((prev) => prev.filter((id) => id !== topicId));
  };

  const allSelectedOnPage =
    paginatedTopics.length > 0 &&
    paginatedTopics.every((t) => selectedIds.includes(t.topicId));

  return (
    <>
      <Wrap>
        <TableCard>
          <StatsStrip>
            <StatItem>
              Showing <strong>{paginatedTopics.length}</strong> of{" "}
              <strong>{topics.length}</strong> topics
            </StatItem>
            <StatItem>
              Page <strong>{currentPage}</strong> of{" "}
              <strong>{Math.max(1, Math.ceil(topics.length / 10))}</strong>
            </StatItem>
          </StatsStrip>

          {topics.length > 0 && (
            <Toolbar>
              <SelectWrap>
                <Checkbox
                  type="checkbox"
                  checked={allSelectedOnPage}
                  onChange={handleSelectAll}
                />
                <span>Select All on Page</span>
              </SelectWrap>

              {selectedIds.length > 0 && (
                <BulkDeleteBtn
                  disabled={loading}
                  onClick={() => handleDeleteClick("bulk")}
                >
                  <Trash2 size={15} />
                  Delete Selected ({selectedIds.length})
                </BulkDeleteBtn>
              )}
            </Toolbar>
          )}

          <TableHead>
            <HeadCell></HeadCell>
            <HeadCell>S.No</HeadCell>
            <HeadCell>Topic Name</HeadCell>
            <HeadCell style={{ textAlign: "center" }}>Action</HeadCell>
          </TableHead>

          {topics.length === 0 ? (
            <EmptyState>
              <span style={{ fontSize: 40 }}>📚</span>
              <span>No topics available yet.</span>
            </EmptyState>
          ) : (
            paginatedTopics.map((topic, index) => {
              const isSelected = selectedIds.includes(topic.topicId);
              return (
                <TopicRow key={topic.topicId} $index={index}>
                  <Checkbox
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleSelectOne(e, topic.topicId)}
                  />
                  <RowIndex>{(currentPage - 1) * 10 + index + 1}</RowIndex>
                  <TopicInfo>
                    <TopicIconDot>
                      {topic.topicName?.charAt(0)?.toUpperCase() || "T"}
                    </TopicIconDot>
                    <TopicLabel>{topic.topicName}</TopicLabel>
                  </TopicInfo>
                  <ActionGroup>
                    <EditBtn
                      title="Edit Topic"
                      onClick={() =>
                        handleOpenModal(topic.topicId, topic.topicName)
                      }
                    >
                      <EditIcon size={15} />
                    </EditBtn>
                    <DeleteBtn
                      title="Delete Topic"
                      disabled={loading}
                      onClick={() => handleDeleteClick(topic.topicId)}
                    >
                      <Trash2 size={15} />
                    </DeleteBtn>
                  </ActionGroup>
                </TopicRow>
              );
            })
          )}
        </TableCard>

        <Pagination
          currentPage={currentPage}
          totalItems={topics.length}
          itemsPerPage={10}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </Wrap>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={executeDelete}
        title={itemToDelete === "bulk" ? "Bulk Delete Topics" : "Delete Topic"}
      />

      <UpdateModal
        isOpen={updateModel}
        onClose={() => setUpdateModal(false)}
        topics={updateDetails}
        onUpdate={updateTopic}
      />
    </>
  );
};

export default Topics;
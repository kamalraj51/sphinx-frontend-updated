import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserExamDetails from "./UserExamDetails";
import Layout from "../component/Layout";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

 const userId = useSelector((state) => state.auth.user);
  console.log("user login id ",userId ,"from all users")

  const handleUser = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/getAllPartyUsers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ createdByUserLogin: userId }),
        }
      );
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setUsers(data.allUser || []);
    } catch (err) {
      console.log("Retrying...");
      setTimeout(handleUser, 1000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleUser();
  }, []);

  if (selectedUser) {
    return (
      <UserExamDetails
        userId={selectedUser.userLoginId}
        userName={selectedUser.name || selectedUser.userLoginId}
        onBack={() => setSelectedUser(null)}
      />
    );
  }

  return (
    <Layout>
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerAccent} />
            <div>
              <h1 style={styles.title}>All Users</h1>
              <p style={styles.subtitle}>
                {users.length} registered user{users.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div style={styles.badge}>{users.length}</div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={styles.loadingWrap}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ ...styles.skeleton, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyIcon}>👤</span>
            <p style={styles.emptyText}>No users found</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {users.map((user, idx) => (
              <UserCard
                key={user.userLoginId || idx}
                user={user}
                onClick={() => setSelectedUser(user)}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700&display=swap');
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .user-card:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 12px 40px rgba(99,102,241,0.18) !important;
          border-color: #6366f1 !important;
        }
        .user-card:hover .arrow-icon {
          opacity: 1 !important;
          transform: translateX(4px) !important;
        }
        .user-card:hover .avatar-ring {
          background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
        }
      `}</style>
    </div>
    </Layout>
  );
};

const UserCard = ({ user, onClick }) => {
  const initials = (user.name || user.userLoginId || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colors = [
    ["#6366f1", "#8b5cf6"],
    ["#ec4899", "#f43f5e"],
    ["#10b981", "#06b6d4"],
    ["#f59e0b", "#ef4444"],
    ["#3b82f6", "#6366f1"],
  ];
  const color = colors[(user.userLoginId || "").length % colors.length];

  return (
    <div
      className="user-card"
      onClick={onClick}
      style={{
        ...styles.card,
        animation: `fadeUp 0.4s ease both`,
      }}
    >
      <div
        className="avatar-ring"
        style={{
          ...styles.avatarRing,
          background: `linear-gradient(135deg, ${color[0]}44, ${color[1]}44)`,
        }}
      >
        <div style={{ ...styles.avatar, background: `linear-gradient(135deg, ${color[0]}, ${color[1]})` }}>
          {initials}
        </div>
      </div>

      <div style={styles.cardInfo}>
        <p style={styles.cardName}>{user.name || "—"}</p>
        <p style={styles.cardId}>{user.userLoginId}</p>
        {user.email && <p style={styles.cardEmail}>{user.email}</p>}
      </div>

      <div style={styles.cardRight}>
        {user.role && <span style={styles.roleTag}>{user.role}</span>}
        <span
          className="arrow-icon"
          style={styles.arrow}
        >
          →
        </span>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
    fontFamily: "'DM Sans', sans-serif",
    padding: "40px 20px",
  },
  container: {
    maxWidth: 820,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 36,
    animation: "fadeUp 0.5s ease both",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  headerAccent: {
    width: 5,
    height: 52,
    borderRadius: 4,
    background: "linear-gradient(180deg, #6366f1, #8b5cf6)",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 28,
    fontWeight: 700,
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    margin: "4px 0 0",
  },
  badge: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    borderRadius: 12,
    padding: "8px 18px",
    fontWeight: 700,
    fontSize: 20,
    fontFamily: "'Syne', sans-serif",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  avatarRing: {
    borderRadius: "50%",
    padding: 3,
    transition: "background 0.25s ease",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    fontFamily: "'Syne', sans-serif",
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    margin: 0,
    color: "#f1f5f9",
    fontWeight: 600,
    fontSize: 15,
  },
  cardId: {
    margin: "2px 0 0",
    color: "#6b7280",
    fontSize: 12,
  },
  cardEmail: {
    margin: "2px 0 0",
    color: "#4b5563",
    fontSize: 11,
  },
  cardRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },
  roleTag: {
    background: "rgba(99,102,241,0.15)",
    color: "#a5b4fc",
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  arrow: {
    color: "#6366f1",
    fontSize: 18,
    opacity: 0,
    transition: "all 0.2s ease",
  },
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  skeleton: {
    height: 78,
    borderRadius: 16,
    background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
    backgroundSize: "400px 100%",
    animation: "shimmer 1.4s ease infinite",
  },
  empty: {
    textAlign: "center",
    padding: "80px 0",
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    color: "#6b7280",
    marginTop: 12,
    fontSize: 15,
  },
};

export default AllUser;

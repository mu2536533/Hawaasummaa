
'use client';

import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "@/services/auth";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const result = await getCurrentUser();

    if (result.success) {
      setUser(result.user);
    }

    setLoading(false);
  };

  const handleLogOut = async () => {
    await logOutUser();
    setUser(null);
  };

  return (
    <div style={{ margin: "10px", textAlign: "center" }}>
      <h1>Welcome to Hawaasummaa social media</h1>
      {loading ? (
        <p>Checking authentication...</p>
      ) : user ? (
        <div>
          <h2>Logged in</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>User ID: {user.id}</p>

          <button
            onClick={handleLogOut}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#0070f3",
              color: "blue",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h2>Not logged in</h2>
          <p>Please login or register to continue.</p>
          <a href="/login" style={{
            textAlign:'center',
            backgroundColor:'black',
            color:'white'}}>
          
          login</a>
        </div>
      )}
     <div>
      <h1>register new user</h1>
      <a href="/register" style={{color:'white', backgroundColor:'rgb(68, 49, 159)'}}>sign up</a>
     </div>
    </div>
  );
}

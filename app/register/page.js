
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(email, password, name);

      if (result.success) {
        setSuccess(true);

        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Registration successful!</h2>
        <p>Redirecting to Home...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Register New User</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <label>Name:</label>
        <input
          type="text"
          placeholder="enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '10px' }}
        />

        <label>Email:</label>
        <input
          type="email"
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px' }}
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
           padding: '10px',
           width: '100%',
           border:'2px solid #044408fd',
           borderRadius:'6px',
            }}
        />

        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          required
          style={{ padding: '10px' }}
        />

        {error && (
          <p style={{ color: 'red' }}>{error}</p>
        )}

        <button type="submit" disabled={loading}
        style={{
        width:'100%',
        padding: '10px',
        backgroundColor:loading ? '#ccc' : '#0070f3',
        color: 'white'
        }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>Already have an account</p>
      <a href="/login">
      
      login
      </a>
    </div>
  );
}

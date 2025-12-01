import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { setDoc, doc, collection, getDocs, query, where } from "firebase/firestore";
import { Form, Card, Alert, Spinner, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext"; 
import Header from "../components/Header";

export default function GuestEmailRequestPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API = "https://server.spotsync.site";

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    
    try {
      if (!currentUser) {
        setError("No user session found.");
        return;
      }

      setLoading(true);
      const userUid = currentUser.uid;

      if (email) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          let isDuplicate = false;
          querySnapshot.forEach((docSnap) => {
            const userData = docSnap.data();
            if (userData.role !== "guest") {
              isDuplicate = true;
            }
          });

          if (isDuplicate) {
            setError("This email is already registered in the system.");
            setLoading(false);
            return;
          }
        }
      }

      await setDoc(
        doc(db, "users", userUid),
        {
          email: email.trim() || null, 
          role: "guest",
          createdAt: new Date(),
          emailVerified: false, 
        },
        { merge: true }
      );
      
      navigate(`/guest/${userUid}`);

    } catch (err) {
      console.error("Error saving guest info:", err);
      setError("Failed to save guest info. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    mainContainer: {
      minHeight: '120vh',
      background: 'linear-gradient(135deg, #475C6F 0%, #1c2c36 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '50px 0',
    },
    formCard: {
      width: "90%",
      maxWidth: "450px",
      borderRadius: '12px',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
      padding: '20px',
    },
    heading: {
      color: '#143447', 
      textAlign: 'center',
      marginBottom: '15px',
      fontWeight: '700',
    },
    
    instructionText: {
      color: '#555',
      fontSize: '0.95rem',
      marginBottom: '20px',
      textAlign: 'center',
    },
    
    inputField: {
      borderColor: '#475C6F',
      borderRadius: '8px',
      padding: '12px 15px',
    },
    saveButton: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
      borderRadius: '8px',
      padding: '10px 20px',
      fontWeight: '600',
      width: '100%',
      marginTop: '15px',
      transition: 'background-color 0.2s',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
    },
    skipLink: {
        fontSize: '0.9rem',
        color: '#475C6F',
        marginTop: '15px',
        cursor: 'pointer',
        textDecoration: 'underline',
    }
  };


  return (
    <>
      <Header />
      <div style={styles.mainContainer}>
        <Card style={styles.formCard}>
          <Card.Body>
            <h3 style={styles.heading}>Provide Contact Email</h3>
            <p style={styles.instructionText}>
              Providing your email will help us contact you if a match is found for your lost item, or if the owner of a found item needs to be contacted.
            </p>

            {error && <Alert variant="danger" style={{ textAlign: 'center' }}>{error}</Alert>}

            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter your email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.inputField}
                  disabled={loading}
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit"
                  style={styles.saveButton}
                  disabled={loading}
                  onMouseEnter={(e) => !loading ? e.currentTarget.style.backgroundColor = '#005bb5' : null}
                  onMouseLeave={(e) => !loading ? e.currentTarget.style.backgroundColor = '#007AFF' : null}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Save & Continue to Report"
                  )}
                </Button>
                
              </div>
            </Form>

          </Card.Body>
        </Card>
      </div>
    </>
  );
}
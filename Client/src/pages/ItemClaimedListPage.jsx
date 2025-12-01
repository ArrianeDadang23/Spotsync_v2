import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import BlankHeader from '../components/BlankHeader';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';

import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

function ItemClaimedListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("All");

  const itemsPerPage = 6;

  useEffect(() => {
    const fetchClaimedItems = async () => {
      try {
        const q = query(collection(db, "claimedItems"), orderBy("dateClaimed", "desc"));
        const querySnapshot = await getDocs(q);

        const claimed = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setItems(claimed);
      } catch (error) {
        console.error("Error fetching claimed items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaimedItems();
  }, []);

  const filteredItems = items.filter(item => {
    if (selectedYear === "All") return true;
    if (!item.dateClaimed) return false;
    const year = new Date(item.dateClaimed).getFullYear();
    return year.toString() === selectedYear;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const styles = {
    foundItemBody: {
      backgroundColor: '#f4f4f4',
      padding: '20px',
      minHeight: '100vh',
    },
    foundItemContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '30px',
      maxWidth: '1200px',
      margin: '20px auto', 
    },
    headerH1: {
      fontSize: '1.8rem',
      color: '#333',
      marginBottom: '20px',
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '8px 15px',
      width: '100%',
      maxWidth: '350px',
      marginBottom: '30px',
    },
    searchInput: {
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      marginLeft: '10px',
      fontSize: '1rem',
      flexGrow: 1,
      color: '#000',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 8px', 
    },
    tableHead: {
      backgroundColor: '#9EBAD6', 
      borderRadius: '8px',
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      color: '#000',
    },
    tableHeaderCell: {
      padding: '15px 10px',
      textAlign: 'left',
      fontWeight: '600',
    },
    tableRow: {
      backgroundColor: '#fff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s',
    },
    tableDataCell: {
      padding: '15px 10px',
      borderTop: '1px solid #eee',
      borderBottom: '1px solid #eee',
      fontSize: '0.95rem',
      color: '#333',
      verticalAlign: 'middle',
    },
    tableFirstCell: {
      borderLeft: '1px solid #eee',
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
    },
    tableLastCell: {
      borderRight: '1px solid #eee',
      borderTopRightRadius: '8px',
      borderBottomRightRadius: '8px',
    },
    profileImage: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      objectFit: "cover",
      cursor: "pointer",
      border: "2px solid #ddd"
    },
    guestPlaceholder: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      backgroundColor: "#ccc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: "10px",
      textAlign: "center"
    },
    paginationContainer: {
      textAlign: 'center',
      padding: '20px 0',
      backgroundColor: '#f9f9f9',
      borderTop: '1px solid #ddd',
      borderBottomLeftRadius: '12px',
      borderBottomRightRadius: '12px',
      marginTop: '10px',
    },
    paginationButton: {
      background: 'none',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '8px 12px',
      margin: '0 5px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      color: '#333',
    },
    paginationButtonActive: {
      backgroundColor: '#007bff',
      color: 'white',
      fontWeight: 'bold',
      border: '1px solid #007bff',
    },
    filterRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      justifyContent: 'space-between',
    },
    personInfo: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    subText: {
        fontSize: '0.85rem',
        color: '#666',
        margin: 0
    },
    mainText: {
        fontWeight: 'bold',
        color: '#333',
        margin: 0
    }
  };

  return (
    <>
      <NavigationBar />
      <BlankHeader />

      <div style={styles.foundItemBody}>
        <div style={styles.foundItemContainer}>
          <h1 style={styles.headerH1}>Claimed List</h1>

          <div style={styles.filterRow}>
            <div style={{...styles.searchBar, marginBottom: '0'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#475C6F" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
              </svg>
              <input style={styles.searchInput} type="text" placeholder='Search' />
            </div>
            
            <div style={{ marginLeft: '40px', display: 'flex', alignItems: 'center' }}>
                <span style={{marginRight: '10px'}}>Academic Year:</span>
                <DropdownButton
                    id="dropdown-academic-year"
                    variant='light'
                    title={selectedYear === "All" ? "All Years" : selectedYear}
                   style={{border: '1px solid #333', borderRadius: '6px'}}
                    
                >
                    <Dropdown.Item onClick={() => setSelectedYear("All")}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedYear("2024")}>2024</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedYear("2025")}>2025</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedYear("2026")}>2026</Dropdown.Item>
                </DropdownButton>
            </div>
          </div>

          <div>
            <table style={styles.table}>
              <thead style={styles.tableHead}>
                <tr>
                  <th style={{...styles.tableHeaderCell, ...styles.tableFirstCell}}>Item ID</th>
                  <th style={styles.tableHeaderCell}>Item Name</th>
                  <th style={styles.tableHeaderCell}>Claimant Photo</th>
                  <th style={styles.tableHeaderCell}>Claimant Details</th>
                  <th style={styles.tableHeaderCell}>Contact Info</th>
                  <th style={{...styles.tableHeaderCell, ...styles.tableLastCell}}>Date Claimed</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "40px", ...styles.tableRow }}>
                      <p style={{ marginTop: '10px' }}>Loading Claimed Items...</p>
                    </td>
                  </tr>
                ) : displayedItems.length > 0 ? (
                  displayedItems.map((item, index) => (
                    <tr style={styles.tableRow} key={index}>
                      {/* Item ID */}
                      <td style={{...styles.tableDataCell, ...styles.tableFirstCell}}>
                        {item.itemId}
                      </td>

                      {/* Item Name */}
                      <td style={styles.tableDataCell}>
                        <span style={styles.mainText}>{item.itemName}</span>
                      </td>

                      {/* Claimant Photo (Base64) */}
                      <td style={styles.tableDataCell}>
                        <div>
                          {item.claimantPhoto ? (
                            <img 
                              src={item.claimantPhoto} 
                              alt="Claimant" 
                              style={styles.profileImage} 
                              onMouseEnter={() => setPreviewImage(item.claimantPhoto)}
                              onMouseLeave={() => setPreviewImage(null)}
                            />
                          ) : (
                            <div style={styles.guestPlaceholder}>No Photo</div>
                          )}
                        </div>
                      </td>

                      {/* Owner / Claimant Details */}
                      <td style={styles.tableDataCell}>
                        <div style={styles.personInfo}>
                            <p style={styles.mainText}>
                                {item.owner?.firstName} {item.owner?.lastName}
                            </p>
                            <p style={styles.subText}>
                                ID: {item.owner?.idNumber || "N/A"}
                            </p>
                        </div>
                      </td>
                      
                      {/* Contact Info */}
                      <td style={styles.tableDataCell}>
                        <div style={styles.personInfo}>
                            <p style={styles.subText}>{item.owner?.email}</p>
                            <p style={styles.subText}>{item.owner?.contactNumber}</p>
                            <p style={{...styles.subText, fontSize: '0.75rem', fontStyle:'italic'}}>{item.owner?.address}</p>
                        </div>
                      </td>
                      
                      {/* Date Claimed */}
                      <td style={{...styles.tableDataCell, ...styles.tableLastCell}}>
                        {item.dateClaimed ? new Date(item.dateClaimed).toLocaleString() : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No claimed items found.</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="6" style={styles.paginationContainer}>
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      disabled={currentPage === 1}
                      style={styles.paginationButton}
                    >
                      {'<'}
                    </button>
                    {[...Array(totalPages)].map((_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        style={{
                          ...styles.paginationButton,
                          ...(currentPage === pageNum && styles.paginationButtonActive)
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                      style={styles.paginationButton}
                    >
                      {'>'}
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {previewImage && (
          <div 
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "10px",
              borderRadius: "10px",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
              zIndex: 9999
            }}
          >
            <img 
              src={previewImage} 
              alt="Preview" 
              style={{ maxWidth: "400px", maxHeight: "400px", borderRadius: "8px" }} 
            />
          </div>
        )}
      </div>
    </>
  );
}

export default ItemClaimedListPage;
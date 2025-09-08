'use client';

import React, { useState, useEffect } from 'react';

export default function TestAdminAccess() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log('TestAdminAccess component loaded');
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    console.log('TestAdminAccess URL params:', { adminParam, search: window.location.search });
    if (adminParam === 'true') {
      console.log('TestAdminAccess: Setting showModal to true');
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 'a') {
        console.log('TestAdminAccess: Ctrl+Alt+A pressed');
        event.preventDefault();
        setShowModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  console.log('TestAdminAccess render:', { showModal });

  return (
    <>
      {/* Always visible test element */}
      <div 
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          backgroundColor: 'red',
          color: 'white',
          padding: '10px',
          zIndex: 99999,
          fontSize: '12px'
        }}
      >
        TEST COMPONENT LOADED
      </div>
      
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              color: 'black'
            }}
          >
            <h2>TEST ADMIN MODAL</h2>
            <p>If you can see this, the component is working!</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

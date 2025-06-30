export default function SimplePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1F2C90', 
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Expert computerhulp
      </h1>
      <p style={{ fontSize: '1.2rem', textAlign: 'center', maxWidth: '600px' }}>
        Direct professionele hulp bij al uw computerproblemen in Rotterdam.
      </p>
      <button style={{
        backgroundColor: '#00d4ff',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        marginTop: '2rem',
        cursor: 'pointer'
      }}>
        Plan een afspraak
      </button>
    </div>
  );
} 
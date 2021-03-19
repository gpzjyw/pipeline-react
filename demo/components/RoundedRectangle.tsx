import React from 'react';

const RoundedRectangle: React.FC = ({ children }) => {
  return (<div style={{ 
    width: '120px', 
    height: '80px',
    lineHeight: '80px',
    textAlign: 'center',
    border: '1px solid #a6acb3',
    background: '#FFF',
    borderRadius: '10px',
  }}>
    {children}
  </div>);
}

export default RoundedRectangle;
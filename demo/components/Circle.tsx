import React from 'react';

const Circle: React.FC<{
  bgColor?: string
}> = ({ children, bgColor }) => {
  return (<div style={{ 
    width: '100px', 
    height: '100px',
    lineHeight: '100px',
    textAlign: 'center',
    border: '1px solid #a6acb3',
    background: bgColor || '#FFF',
    borderRadius: '50%',
    color: bgColor ? '#fff' : '#000',
  }}>
    {children}
  </div>);
}

export default Circle;
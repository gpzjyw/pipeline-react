import React from 'react';
import Pipeline from '../src';
import '../src/index.less';

const Info: React.FC = ({ children }) => {
  return (<div style={{ 
    width: '120px', 
    height: '80px',
    lineHeight: '80px',
    textAlign: 'center',
    border: '1px solid #a6acb3',
    background: '#FFF',
  }}>
    {children}
  </div>);
}

const demo1 = () => {
  const subTasks = [
    {
      key: '1',
      outSides: ['2', '3'],
      data: {
        name: '开始'
      }
    },
    {
      key: '2',
      outSides: ['5', '6', '8'],
    },
    { key: '3', outSides: ['4'] },
    {
      key: '4',
      outSides: ['5', '6', '8'],
    },
    { key: '5', outSides: ['11'] },
    { key: '6', outSides: ['7'] },
    { key: '7', outSides: ['11'] },
    { key: '8', outSides: ['9'] },
    { key: '9', outSides: ['10'] },
    { key: '10', outSides: ['11'] },
    { key: '11', outSides: [], data: { name: '结束' } }
  ]
  return (
    <div 
      style={{
        width: '100vw'
      }}
    >
      <Pipeline
        subTasks={subTasks}
        render={(data, key) => <Info>{data ? data.name : `节点：${key}`}</Info>}
        topOffset={40}
      />
    </div>
  );
};

export default demo1;
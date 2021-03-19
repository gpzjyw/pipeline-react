import React from 'react';
import Pipeline, { IOriginSubtask } from '../src';
import RoundedRectangle from './components/RoundedRectangle';
import Circle from './components/Circle';
import '../src/index.less';

const bgCorlorMap = {
  success: '#018145',
  error: '#D73435',
  doing: '#146FD2',
  undo: '#82888F',
}

const subTasks: IOriginSubtask<{
  name: string;
  status?: string;
}>[] = [
  {
    key: '1',
    outSides: ['2', '3'],
    data: {
      name: '开始',
      status: ''
    }
  },
  {
    key: '2',
    outSides: ['5', '6', '8'],
    data: {
      name: '构建',
      status: 'success',
    }
  },
  { 
    key: '3', 
    outSides: ['4'],
    data: {
      name: '代码扫描',
      status: 'success',
    }
  },
  {
    key: '4',
    outSides: ['5', '6', '8'],
    data: {
      name: '代码review',
      status: 'doing',
    }
  },
  { key: '5', outSides: ['11'], data: {
    name: '单元测试',
    status: 'error'
  } },
  { key: '6', outSides: ['7'] },
  { key: '7', outSides: ['11'] },
  { key: '8', outSides: ['9'] },
  { key: '9', outSides: ['10'] },
  { key: '10', outSides: ['11'] },
  { key: '11', outSides: [], data: { name: '发布确认' } }
];

const demo1 = () => {
  return (
    <div 
      style={{
        width: '100vw'
      }}
    >
      <Pipeline
        subTasks={subTasks}
        render={(data, key) => <RoundedRectangle>{data ? data.name : `节点：${key}`}</RoundedRectangle>}
        topOffset={40}
      />

      <Pipeline 
        subTasks={subTasks}
        render={(data, key) => <Circle
          bgColor={bgCorlorMap[data?.status || 'undo']}
        >{data ? data.name : `节点：${key}`}</Circle>}
        topOffset={50}
      />
    </div>
  );
};

export default demo1;
/* eslint-disable no-undef */
import Pipeline from './index';

const traverseGraph = Pipeline.prototype.traverseGraph;
const hasLoop = Pipeline.prototype.hasLoop;

expect.extend({
  isSameArrayObject(received: any, target: any) {
    const pass = JSON.stringify(received) === JSON.stringify(target);
    if (pass) {
      return {
        message: () => '比对通过',
        pass: true,
      };
    } else {
      return {
        message: () => {
          return '比对不通过';
        },
        pass: false,
      };
    }
  },
});

const testCasesArr = [
  {
    title: '无任务',
    input: [],
    output: [],
  },
  {
    title: '单任务',
    input: [{ key: '1', outSides: [] }],
    output: [{ key: '1' }],
  },
  {
    title: '串行',
    input: [
      { key: '1', outSides: ['2'] },
      { key: '2', outSides: ['3'] },
      { key: '3', outSides: ['4'] },
      { key: '4', outSides: ['5'] },
      { key: '5', outSides: [] },
    ],
    output: [
      { key: '1' },
      { key: '2' },
      { key: '3' },
      { key: '4' },
      { key: '5' },
    ],
  },
  {
    title: '并行（单点-单点），单点',
    input: [
      { key: '1', outSides: ['4'] },
      { key: '2', outSides: ['4'] },
      { key: '3', outSides: ['4'] },
      { key: '4', outSides: [] },
    ],
    output: [
      [
        { key: '1' },
        { key: '2' },
        { key: '3' },
      ],
      { key: '4' },
    ],
  },
  {
    title: '并行（单点-双点），单点',
    input: [
      { key: '1', outSides: ['2'] },
      { key: '2', outSides: ['4'] },
      { key: '3', outSides: ['4'] },
      { key: '4', outSides: [] },
    ],
    output: [
      [
        [
          { key: '1' },
          { key: '2' },
        ],
        { key: '3' },
      ],
      { key: '4' },
    ],
  },
  {
    title: '并行（双点-双点），单点',
    input: [
      { key: '1', outSides: ['2'] },
      { key: '2', outSides: ['5'] },
      { key: '3', outSides: ['4'] },
      { key: '4', outSides: ['5'] },
      { key: '5', outSides: [] },
    ],
    output: [
      [
        [
          { key: '1' },
          { key: '2' },
        ],
        [
          { key: '3' },
          { key: '4' },
        ],
      ],
      { key: '5' },
    ],
  },
  {
    title: '单点，并行（单点-单点），单点',
    input: [
      {
        key: '1',
        outSides: ['2', '3'],
      },
      { key: '2', outSides: ['4'] },
      { key: '3', outSides: ['4'] },
      { key: '4', outSides: [] },
    ],
    output: [
      { key: '1' },
      [
        { key: '2' },
        { key: '3' },
      ],
      { key: '4' },
    ],
  },
  {
    title: '并行(单点-单点)，并行(单点-单点)',
    input: [
      {
        key: '1',
        outSides: ['3', '4'],
      },
      {
        key: '2',
        outSides: ['3', '4'],
      },
      { key: '3', outSides: [] },
      { key: '4', outSides: [] },
    ],
    output: [
      [
        { key: '1' },
        { key: '2' },
      ],
      [
        { key: '3' },
        { key: '4' },
      ],
    ],
  },
  {
    title: '单点，并行(单点，双点)，并行(单点，双点，三点)',
    input: [
      {
        key: '1',
        outSides: ['2', '3'],
      },
      {
        key: '2',
        outSides:
          ['5', '6', '8'],
      },
      { key: '3', outSides: ['4'] },
      {
        key: '4',
        outSides:
          ['5', '6', '8'],
      },
      { key: '5', outSides: [] },
      { key: '6', outSides: ['7'] },
      { key: '7', outSides: [] },
      { key: '8', outSides: ['9'] },
      { key: '9', outSides: ['10'] },
      { key: '10', outSides: [] },
    ],
    output: [
      { key: '1' },
      [
        { key: '2' },
        [
          { key: '3' },
          { key: '4' },
        ],
      ],
      [
        { key: '5' },
        [
          { key: '6' },
          { key: '7' },
        ],
        [
          { key: '8' },
          { key: '9' },
          { key: '10' },
        ],
      ],
    ],
  },
  {
    title: '异常数据',
    input: [
      {
        key: '1',
        outSides: ['2', '3'],
      },
    ],
    output: [{ key: '1' }],
  },
];

const loopCasesArr = [
  {
    title: '有环',
    input: [
      { key: '1', outSides: ['2'] },
      { key: '2', outSides: ['3'] },
      { key: '3', outSides: ['1'] },
    ],
  },
  {
    title: '有环',
    input: [
      { key: '1', outSides: ['4'] },
      { key: '2', outSides: ['4'] },
      { key: '3', outSides: ['4'] },
      { key: '4', outSides: ['1'] },
    ],
  },
];

describe('基于服务端数据处理成前端需要的数据结构是否正确', () => {
  testCasesArr.forEach(({ title, input, output }) => {
    it(title, () => {
      expect(traverseGraph(input)).isSameArrayObject(output);
    });
  });
  testCasesArr.forEach(({ title, input }) => {
    it(`无环：${title}`, () => {
      expect(hasLoop(input)).toBeFalsy();
    });
  });
  loopCasesArr.forEach(({ title, input }) => {
    it(title, () => {
      expect(hasLoop(input)).toBeTruthy();
    });
  });
});

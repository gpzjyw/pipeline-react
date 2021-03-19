import React, { Component } from 'react';
import classnames from 'classnames';
import Graph from './util/Graph';
import Node from './util/Node';
import { IOriginSubtask, IRenderData, IRenderSubtask } from './interface';

export { IOriginSubtask };

interface IPipelineProps<T> {
  subTasks: IOriginSubtask<T>[];
  className?: string;
  parallelAdd?: boolean;
  render: (param: T, key: string) => React.ReactNode;
  topOffset?: number;
}

class Index<T = any> extends Component<IPipelineProps<T>> {
  private traverseGraph(subTasks: IOriginSubtask<T>[]) {
    const graph = new Graph(subTasks);
    const allNodesSet = new Set(graph.getAllNodes());

    let traverseNode: undefined | Node<T>;

    /**
     * 串行遍历（当遇到交点、分叉点、终点的时候停止）
     * @param node 
     */
    function traverseSerial(node: Node<T>) {
      traverseNode = node;
      allNodesSet.delete(traverseNode);
      const arr: IRenderSubtask<T>[] = [{
        key: traverseNode.key,
        data: traverseNode.data,
      }];
      while (traverseNode.outSides.length === 1 && 
        !traverseNode.outSides.some((n) => n.isJointNode())) {
        traverseNode = traverseNode.outSides[0];
        allNodesSet.delete(traverseNode);
        arr.push({
          key: traverseNode.key,
          data: traverseNode.data,
        });
      }
      return arr.length === 1 ? arr[0] : arr;
    }

    function traverseParallel(nodes: Node<T>[]) {
      return nodes.map((node) => traverseSerial(node));
    }

    const result: IRenderData<T>[] = [];
    while (allNodesSet.size > 0) {
      // 首次遍历边界处理
      const startNodes = traverseNode ? traverseNode.outSides : graph.getStartNodes();
      if (startNodes.length === 1) {
        const traRes = traverseSerial(startNodes[0]);
        if (Array.isArray(traRes)) {
          result.push(...traRes);
        } else {
          result.push(traRes);
        }
      } else {
        result.push(traverseParallel(startNodes));
      }
    }
    return result;
  }

  private renderData = (subtask: IRenderData<T>, isSerial: boolean) => {
    const { render, topOffset } = this.props;
    const Line = (<>
      <div className="u-line" style={{ height: topOffset || 0 }} />
      <div className="u-vertical u-vertical-left" style={{ top: topOffset || 0 }} />
      <div className="u-vertical u-vertical-right" style={{ top: topOffset || 0 }} />
    </>);
    return (<li>
      {Array.isArray(subtask) ? <>
        {Line}
        <ul className={classnames(isSerial ? 'm-serial' : 'm-parallel')}>
          {subtask.map((item) => this.renderData(item, !isSerial))}
        </ul>
      </> : <>
        {Line}
        <div className="m-content">
          {render(subtask.data, subtask.key)}
        </div>
      </>}
    </li>);
  }

  private hasLoop(subTasks: IOriginSubtask<T>[]) {
    const graph = new Graph(subTasks);
    let startNodes = graph.getStartNodes();

    while (startNodes.length > 0) {
      graph.deleteNode(...startNodes.map((item) => item.key));
      startNodes = graph.getStartNodes();
    }

    return graph.getAllNodes().length > 0;
  }

  public render() {
    const { className, subTasks } = this.props;
    if (this.hasLoop(subTasks)) {
      return (<div className={classnames(className, 'u-mg30')} style={{ color: 'red' }}>
        流水线渲染异常：当前子任务中存在循环依赖
      </div>);
    } else {
      return (<div className={classnames(
        'pipeline-visual',
        className
      )}>
        <ul className="m-serial">
          {this.traverseGraph(subTasks).map((subtask) => this.renderData(subtask, false))}
        </ul>
      </div>);
    }
  }
}

export default Index;

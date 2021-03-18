import Node from './Node';
import { IOriginSubtask, IRenderSubtask } from '../interface';

class Graph<T> {
  private nodeMap: {
    [name: string]: Node<T>;
  };

  constructor(subTasks: IOriginSubtask<T>[]) {
    // 图中的节点集合
    this.nodeMap = {};
    // 初始化各个顶点
    subTasks.forEach((item: IOriginSubtask<T>) => this.initNode(item, subTasks));
  }

  /**
   * 获取起始节点(入度为0的节点)
   */
  public getStartNodes() {
    const startNodes: Node<T>[] = [];
    for (const key in this.nodeMap) {
      if (this.nodeMap[key] && this.nodeMap[key].inSides.length === 0) {
        startNodes.push(this.nodeMap[key]);
      }
    }
    return startNodes;
  }
  
  /**
   * 以数组的形式表示该图结构
   */
  public graph2Array(): IOriginSubtask<T>[] {
    return this.getAllNodes().map((node) => ({
      key: node.key,
      data: node.data,
      outSides: node.outSides.map((node) => node.key),
    }));
  }

  public getAllNodes() {
    const nodesArr: Node<T>[] = [];
    for (const key in this.nodeMap) {
      if (this.nodeMap[key]) {
        nodesArr.push(this.nodeMap[key]);
      }
    }
    return nodesArr;
  }

  /**
   * 向图的头部添加起点
   * @param newSubtask 
   */
  public addStart(newSubtask: IRenderSubtask<T>) {
    const startNodes = this.getStartNodes();
    const newNode = this.initNode(newSubtask);
    newNode.addOutSides(...startNodes);
    startNodes.forEach((node: Node<T>) => {
      node.addInSides(newNode);
    });
  }

  /**
   * 向图的尾部添加终点
   * @param newSubtask 
   */
  public addEnd(newSubtask: IRenderSubtask<T>) {
    const endNodes = [];
    for (const key in this.nodeMap) {
      if (this.nodeMap[key].outSides.length === 0) {
        endNodes.push(this.nodeMap[key]);
      }
    }
    const newNode = this.initNode(newSubtask);
    newNode.addInSides(...endNodes);
    endNodes.forEach((node) => {
      node.addOutSides(newNode);
    });
  }

  /**
   * 向某个节点的前面（或后面）添加串行节点
   * @param key 
   * @param newSubtask 
   * @param isBefore 
   */
  public addNode(key: string, newSubtask: IRenderSubtask<T>, isBefore: boolean) {
    const currentNode = this.nodeMap[key];
    const newNode = this.initNode(newSubtask);
    if (isBefore) {
      currentNode.addPrevNode(newNode);
    } else {
      currentNode.addNextNode(newNode);
    }
  }

  /**
   * 向某个节点(或某组节点)添加并行节点
   * @param subtask 
   * @param newSubtask 
   */
  public addParallelNode(key: string | string[], newSubtask: IRenderSubtask<T>) {
    let startNode: Node<T> | undefined;
    let endNode: Node<T> | undefined;
    if (Array.isArray(key)) {
      startNode = this.nodeMap[key[0]];
      endNode = this.nodeMap[key[key.length - 1]];
    } else {
      startNode = this.nodeMap[key];
      endNode = this.nodeMap[key];
    }
    const newNode = this.initNode(newSubtask);
    startNode.inSides.forEach((node) => {
      node.addOutSides(newNode);
      newNode.addInSides(node);
    });
    endNode.outSides.forEach((node) => {
      node.addInSides(newNode);
      newNode.addOutSides(node);
    });
  }

  /**
   * 将某个或多个节点删除，并视情况是否将其的上下游节点相连
   * @param keys 
   */
  public deleteNode(...keys: string[]) {
    keys.forEach(key => {
      if (this.nodeMap[key]) {
        this.nodeMap[key].deleteSelf();
        delete this.nodeMap[key];
      }
    })
  }

  /**
   * 更新某个节点的data
   * @param subtask 
   * @param newSubtask 
   */
  public updateNode(key: string, newData: T) {
    this.nodeMap[key].data = newData;
  }

  /**
   * 初始化node，若已存在，则不重复创建
   * @param subtask 
   * @param originSubTasks 初始构造图时，需要从原始数据中获得节点信息
   */
  private initNode(subtask: IOriginSubtask<T>, originSubTasks?: IOriginSubtask<T>[]) {
    if (!this.nodeMap[subtask.key]) {
      this.nodeMap[subtask.key] = new Node(subtask);
      if (subtask.outSides && originSubTasks) {
        const outSides = subtask.outSides
          .map((key) => 
            originSubTasks.find(item => item.key === key)
          )
          .filter(item => item)
          .map((outsideSubtask) => outsideSubtask && this.initNode(outsideSubtask, originSubTasks));
        this.nodeMap[subtask.key].addOutSides(...outSides);
        outSides.forEach((node) => {
          node.addInSides(this.nodeMap[subtask.key]);
        });
      }
    }
    return this.nodeMap[subtask.key];
  }
}

export default Graph;

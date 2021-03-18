import { IOriginSubtask } from '../interface';

class Node<T> {
  public key: string;
  public data: T;
  public inSides: Node<T>[];
  public outSides: Node<T>[];

  constructor(subtask: IOriginSubtask<T>) {
    this.key = subtask.key;
    this.data = subtask.data;
    this.inSides = [];
    this.outSides = [];
  }

  public isJointNode() {
    return this.inSides.length >= 2;
  }

  public addOutSides(...nodes: Node<T>[]) {
    this.outSides.push(...nodes);
  }

  public addInSides(...nodes: Node<T>[]) {
    this.inSides.push(...nodes);
  }

  public removeInSides(...nodes: Node<T>[]) {
    nodes.forEach((node) => this.replaceInSides(node));
  }

  public removeOutSides(...nodes: Node<T>[]) {
    nodes.forEach((node) => this.replaceOutSides(node));
  }

  /**
   * 将入边中的某节点（0或1个）替换成某些节点（0或n个）
   * 删除节点：1,0
   * 替换节点：1,n
   * 增加节点：0,n
   * @param originNode 
   * @param newNodes 
   */
  public replaceInSides(originNode: Node<T> | null, ...newNodes: Node<T>[]) {
    const newSides = [];
    for (const iterator of this.inSides) {
      if (originNode === iterator) {
        newSides.push(...newNodes);
      } else {
        newSides.push(iterator);
      }
    }
    this.inSides = newSides;
  }

  public replaceOutSides(originNode: Node<T>, ...newNodes: Node<T>[]) {
    const newSides = [];
    for (const iterator of this.outSides) {
      if (originNode === iterator) {
        newSides.push(...newNodes);
      } else {
        newSides.push(iterator);
      }
    }
    this.outSides = newSides;
  }

  public addPrevNode(newNode: Node<T>) {
    newNode.addOutSides(this);
    newNode.addInSides(...this.inSides);
    this.inSides.forEach((node: Node<T>) => node.replaceOutSides(this, newNode));
    this.inSides = [newNode];
  }

  public addNextNode(newNode: Node<T>) {
    newNode.addInSides(this);
    newNode.addOutSides(...this.outSides);
    this.outSides.forEach((node: Node<T>) => node.replaceInSides(this, newNode));
    this.outSides = [newNode];
  }

  public deleteSelf() {
    const inSides = this.inSides;
    const outSides = this.outSides;
    if (inSides.some((node) => node.outSides.length >= 2) 
      && outSides.some((node) => node.inSides.length >= 2)) {
      inSides.forEach((node) => node.removeOutSides(this));
      outSides.forEach((node) => node.removeInSides(this));
    } else {
      inSides.forEach((node) => node.replaceOutSides(this, ...outSides));
      outSides.forEach((node) => node.replaceInSides(this, ...inSides));
    }
  }
}

export default Node;

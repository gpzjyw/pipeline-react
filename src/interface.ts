export interface IOriginSubtask<T> {
  key: string;
  outSides?: string[] | null;
  data?: T;
}

export type IRenderSubtask<T> = Omit<IOriginSubtask<T> ,'outSides'>;

export type IRenderData<T> = IRenderSubtask<T> | (IRenderSubtask<T> | IRenderSubtask<T>[])[];
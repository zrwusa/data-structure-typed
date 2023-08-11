import {SinglyLinkedList} from '../linked-list';

/** Type used for filter and find methods, returning a boolean */
export type TTestFunction<NodeData> = (
    data: NodeData,
    index: number,
    list: SinglyLinkedList<NodeData>,
) => boolean;

/** Type used for map and forEach methods, returning anything */
export type TMapFunction<NodeData> = (
    data: any,
    index: number,
    list: SinglyLinkedList<NodeData>,
) => any;

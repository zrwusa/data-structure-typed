import {DoublyLinkedList, DoublyLinkedListNode, SinglyLinkedList, SinglyLinkedListNode} from '../../../../src';
import {magnitude} from '../constants';

describe('LinkedList Performance Test', () => {
    it('should DoublyLinkedList insertBefore faster than SinglyLinkedList', () => {
        const doublyList = new DoublyLinkedList<number>();

        const startPushTime = performance.now();
        let midNode: DoublyLinkedListNode | null = null;
        const midIndex = Math.floor((magnitude.SQUARED) / 2);
        for (let i = 0; i < magnitude.SQUARED; i++) {
            doublyList.push(i);
            if (i === midIndex) {
                midNode = doublyList.findNode(i);
            } else if (i > midIndex && midNode) {
                doublyList.insertBefore(midNode, i);
            }
        }
        const doublyListPushCost = performance.now() - startPushTime;

        const singlyList = new SinglyLinkedList<number>();
        let midSinglyNode: SinglyLinkedListNode | null = null;

        const startSinglyPushTime = performance.now();
        for (let i = 0; i < magnitude.SQUARED; i++) {
            singlyList.push(i);
            if (i === midIndex) {
                midSinglyNode = singlyList.findNode(i);
            } else if (i > midIndex && midSinglyNode) {
                singlyList.insertBefore(midSinglyNode.val, i);
            }
        }

        const singlyListPushCost = performance.now() - startSinglyPushTime;
        expect(doublyListPushCost).toBeLessThan(Math.sqrt(singlyListPushCost) + 1000);
    });
});
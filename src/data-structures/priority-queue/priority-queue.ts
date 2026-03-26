/**
 * data-structure-typed
 *
 * @author Kirk Qi
 * @copyright Copyright (c) 2022 Kirk Qi <qilinaus@gmail.com>
 * @license MIT License
 */

import type { PriorityQueueOptions } from '../../types';
import { Heap } from '../heap';

/**
 * @example
 * // Hospital emergency room triage
 *  interface Patient {
 *       name: string;
 *       severity: number; // 1 = critical, 5 = minor
 *     }
 *
 *     const er = new PriorityQueue<Patient>([], {
 *       comparator: (a, b) => a.severity - b.severity
 *     });
 *
 *     er.add({ name: 'Flu symptoms', severity: 4 });
 *     er.add({ name: 'Heart attack', severity: 1 });
 *     er.add({ name: 'Broken arm', severity: 3 });
 *     er.add({ name: 'Stroke', severity: 1 });
 *
 *     // Most critical patients first
 *     console.log(er.poll()?.severity); // 1;
 *     console.log(er.poll()?.severity); // 1;
 *     console.log(er.poll()?.severity); // 3;
 *     console.log(er.poll()?.severity); // 4;
 * @example
 * // Task scheduler with deadlines
 *  interface Task {
 *       name: string;
 *       deadline: number; // hours until due
 *     }
 *
 *     const scheduler = new PriorityQueue<Task>([], {
 *       comparator: (a, b) => a.deadline - b.deadline
 *     });
 *
 *     scheduler.add({ name: 'Report', deadline: 24 });
 *     scheduler.add({ name: 'Email', deadline: 2 });
 *     scheduler.add({ name: 'Meeting prep', deadline: 4 });
 *     scheduler.add({ name: 'Code review', deadline: 8 });
 *
 *     // Process most urgent first
 *     console.log(scheduler.peek()?.name); // 'Email';
 *     console.log(scheduler.size); // 4;
 *
 *     const order = [];
 *     while (scheduler.size > 0) {
 *       order.push(scheduler.poll()!.name);
 *     }
 *     console.log(order); // ['Email', 'Meeting prep', 'Code review', 'Report'];
 * @example
 * // Bandwidth allocation with priorities
 *  const bandwidth = new PriorityQueue<[number, string]>([], {
 *       comparator: (a, b) => a[0] - b[0]
 *     });
 *
 *     bandwidth.add([1, 'Video call']);     // highest priority
 *     bandwidth.add([3, 'File download']);
 *     bandwidth.add([2, 'Web browsing']);
 *     bandwidth.add([1, 'Voice call']);
 *
 *     // Allocate bandwidth to highest priority first
 *     console.log(bandwidth.poll()?.[1]); // 'Video call';
 *     console.log(bandwidth.poll()?.[1]); // 'Voice call';
 *     console.log(bandwidth.size); // 2;
 */
export class PriorityQueue<E = any, R = any> extends Heap<E, R> {
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: PriorityQueueOptions<E, R>) {
    super(elements, options);
  }
}

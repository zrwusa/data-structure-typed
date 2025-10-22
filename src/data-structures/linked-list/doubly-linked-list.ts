/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */

import type { DoublyLinkedListOptions, ElementCallback, LinearBaseOptions } from '../../types';
import { LinearLinkedBase, LinkedListNode } from '../base/linear-base';

/**
 * Node of a doubly linked list; stores value and prev/next links.
 * @remarks Time O(1), Space O(1)
 * @template E
 */
export class DoublyLinkedListNode<E = any> extends LinkedListNode<E> {
  /**
   * Create a node.
   * @remarks Time O(1), Space O(1)
   * @param value - Element value to store.
   * @returns New node instance.
   */

  constructor(value: E) {
    super(value);
    this._value = value;
    this._next = undefined;
    this._prev = undefined;
  }

  protected override _next: DoublyLinkedListNode<E> | undefined;

  /**
   * Get the next node link.
   * @remarks Time O(1), Space O(1)
   * @returns Next node or undefined.
   */

  override get next(): DoublyLinkedListNode<E> | undefined {
    return this._next;
  }

  /**
   * Set the next node link.
   * @remarks Time O(1), Space O(1)
   * @param value - Next node or undefined.
   * @returns void
   */

  override set next(value: DoublyLinkedListNode<E> | undefined) {
    this._next = value;
  }

  protected _prev: DoublyLinkedListNode<E> | undefined;

  /**
   * Get the previous node link.
   * @remarks Time O(1), Space O(1)
   * @returns Previous node or undefined.
   */

  get prev(): DoublyLinkedListNode<E> | undefined {
    return this._prev;
  }

  /**
   * Set the previous node link.
   * @remarks Time O(1), Space O(1)
   * @param value - Previous node or undefined.
   * @returns void
   */

  set prev(value: DoublyLinkedListNode<E> | undefined) {
    this._prev = value;
  }
}

/**
 * Doubly linked list with O(1) push/pop/unshift/shift and linear scans.
 * @remarks Time O(1), Space O(1)
 * @template E
 * @template R
 * 1. Node Structure: Each node contains three parts: a data field, a pointer (or reference) to the previous node, and a pointer to the next node. This structure allows traversal of the linked list in both directions.
 * 2. Bidirectional Traversal: Unlike singly linked lists, doubly linked lists can be easily traversed forwards or backwards. This makes insertions and deletions in the list more flexible and efficient.
 * 3. No Centralized Index: Unlike arrays, elements in a linked list are not stored contiguously, so there is no centralized index. Accessing elements in a linked list typically requires traversing from the head or tail node.
 * 4. High Efficiency in Insertion and Deletion: Adding or removing elements in a linked list does not require moving other elements, making these operations more efficient than in arrays.
 * Caution: Although our linked list classes provide methods such as at, setAt, addAt, and indexOf that are based on array indices, their time complexity, like that of the native Array.lastIndexOf, is 𝑂(𝑛). If you need to use these methods frequently, you might want to consider other data structures, such as Deque or Queue (designed for random access). Similarly, since the native Array.shift method has a time complexity of 𝑂(𝑛), using an array to simulate a queue can be inefficient. In such cases, you should use Queue or Deque, as these data structures leverage deferred array rearrangement, effectively reducing the average time complexity to 𝑂(1).
 * @example
 * // text editor operation history
 *     const actions = [
 *       { type: 'insert', content: 'first line of text' },
 *       { type: 'insert', content: 'second line of text' },
 *       { type: 'delete', content: 'delete the first line' }
 *     ];
 *     const editorHistory = new DoublyLinkedList<{ type: string; content: string }>(actions);
 *
 *     console.log(editorHistory.last?.type); // 'delete'
 *     console.log(editorHistory.pop()?.content); // 'delete the first line'
 *     console.log(editorHistory.last?.type); // 'insert'
 * @example
 * // Browser history
 *     const browserHistory = new DoublyLinkedList<string>();
 *
 *     browserHistory.push('home page');
 *     browserHistory.push('search page');
 *     browserHistory.push('details page');
 *
 *     console.log(browserHistory.last); // 'details page'
 *     console.log(browserHistory.pop()); // 'details page'
 *     console.log(browserHistory.last); // 'search page'
 * @example
 * // Use DoublyLinkedList to implement music player
 *     // Define the Song interface
 *     interface Song {
 *       title: string;
 *       artist: string;
 *       duration: number; // duration in seconds
 *     }
 *
 *     class Player {
 *       private playlist: DoublyLinkedList<Song>;
 *       private currentSong: ReturnType<typeof this.playlist.getNodeAt> | undefined;
 *
 *       constructor(songs: Song[]) {
 *         this.playlist = new DoublyLinkedList<Song>();
 *         songs.forEach(song => this.playlist.push(song));
 *         this.currentSong = this.playlist.head;
 *       }
 *
 *       // Play the next song in the playlist
 *       playNext(): Song | undefined {
 *         if (!this.currentSong?.next) {
 *           this.currentSong = this.playlist.head; // Loop to the first song
 *         } else {
 *           this.currentSong = this.currentSong.next;
 *         }
 *         return this.currentSong?.value;
 *       }
 *
 *       // Play the previous song in the playlist
 *       playPrevious(): Song | undefined {
 *         if (!this.currentSong?.prev) {
 *           this.currentSong = this.playlist.tail; // Loop to the last song
 *         } else {
 *           this.currentSong = this.currentSong.prev;
 *         }
 *         return this.currentSong?.value;
 *       }
 *
 *       // Get the current song
 *       getCurrentSong(): Song | undefined {
 *         return this.currentSong?.value;
 *       }
 *
 *       // Loop through the playlist twice
 *       loopThroughPlaylist(): Song[] {
 *         const playedSongs: Song[] = [];
 *         const initialNode = this.currentSong;
 *
 *         // Loop through the playlist twice
 *         for (let i = 0; i < this.playlist.length * 2; i++) {
 *           playedSongs.push(this.currentSong!.value);
 *           this.currentSong = this.currentSong!.next || this.playlist.head; // Loop back to the start if needed
 *         }
 *
 *         // Reset the current song to the initial song
 *         this.currentSong = initialNode;
 *         return playedSongs;
 *       }
 *     }
 *
 *     const songs = [
 *       { title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 },
 *       { title: 'Hotel California', artist: 'Eagles', duration: 391 },
 *       { title: 'Shape of You', artist: 'Ed Sheeran', duration: 233 },
 *       { title: 'Billie Jean', artist: 'Michael Jackson', duration: 294 }
 *     ];
 *     let player = new Player(songs);
 *     // should play the next song
 *     player = new Player(songs);
 *     const firstSong = player.getCurrentSong();
 *     const nextSong = player.playNext();
 *
 *     // Expect the next song to be "Hotel California by Eagles"
 *     console.log(nextSong); // { title: 'Hotel California', artist: 'Eagles', duration: 391 }
 *     console.log(firstSong); // { title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 }
 *
 *     // should play the previous song
 *     player = new Player(songs);
 *     player.playNext(); // Move to the second song
 *     const currentSong = player.getCurrentSong();
 *     const previousSong = player.playPrevious();
 *
 *     // Expect the previous song to be "Bohemian Rhapsody by Queen"
 *     console.log(previousSong); // { title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 }
 *     console.log(currentSong); // { title: 'Hotel California', artist: 'Eagles', duration: 391 }
 *
 *     // should loop to the first song when playing next from the last song
 *     player = new Player(songs);
 *     player.playNext(); // Move to the second song
 *     player.playNext(); // Move to the third song
 *     player.playNext(); // Move to the fourth song
 *
 *     const nextSongToFirst = player.playNext(); // Should loop to the first song
 *
 *     // Expect the next song to be "Bohemian Rhapsody by Queen"
 *     console.log(nextSongToFirst); // { title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 }
 *
 *     // should loop to the last song when playing previous from the first song
 *     player = new Player(songs);
 *     player.playNext(); // Move to the first song
 *     player.playNext(); // Move to the second song
 *     player.playNext(); // Move to the third song
 *     player.playNext(); // Move to the fourth song
 *
 *     const previousToLast = player.playPrevious(); // Should loop to the last song
 *
 *     // Expect the previous song to be "Billie Jean by Michael Jackson"
 *     console.log(previousToLast); // { title: 'Billie Jean', artist: 'Michael Jackson', duration: 294 }
 *
 *     // should loop through the entire playlist
 *     player = new Player(songs);
 *     const playedSongs = player.loopThroughPlaylist();
 *
 *     // The expected order of songs for two loops
 *     console.log(playedSongs); // [
 *  //      { title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 },
 *  //      { title: 'Hotel California', artist: 'Eagles', duration: 391 },
 *  //      { title: 'Shape of You', artist: 'Ed Sheeran', duration: 233 },
 *  //      { title: 'Billie Jean', artist: 'Michael Jackson', duration: 294 },
 *  //      { title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 },
 *  //      { title: 'Hotel California', artist: 'Eagles', duration: 391 },
 *  //      { title: 'Shape of You', artist: 'Ed Sheeran', duration: 233 },
 *  //      { title: 'Billie Jean', artist: 'Michael Jackson', duration: 294 }
 *  //    ]
 * @example
 * // Use DoublyLinkedList to implement LRU cache
 *     interface CacheEntry<K, V> {
 *       key: K;
 *       value: V;
 *     }
 *
 *     class LRUCache<K = string, V = any> {
 *       private readonly capacity: number;
 *       private list: DoublyLinkedList<CacheEntry<K, V>>;
 *       private map: Map<K, DoublyLinkedListNode<CacheEntry<K, V>>>;
 *
 *       constructor(capacity: number) {
 *         if (capacity <= 0) {
 *           throw new Error('lru cache capacity must be greater than 0');
 *         }
 *         this.capacity = capacity;
 *         this.list = new DoublyLinkedList<CacheEntry<K, V>>();
 *         this.map = new Map<K, DoublyLinkedListNode<CacheEntry<K, V>>>();
 *       }
 *
 *       // Get the current cache length
 *       get length(): number {
 *         return this.list.length;
 *       }
 *
 *       // Check if it is empty
 *       get isEmpty(): boolean {
 *         return this.list.isEmpty();
 *       }
 *
 *       // Get cached value
 *       get(key: K): V | undefined {
 *         const node = this.map.get(key);
 *
 *         if (!node) return undefined;
 *
 *         // Move the visited node to the head of the linked list (most recently used)
 *         this.moveToFront(node);
 *
 *         return node.value.value;
 *       }
 *
 *       // Set cache value
 *       set(key: K, value: V): void {
 *         // Check if it already exists
 *         const node = this.map.get(key);
 *
 *         if (node) {
 *           // Update value and move to head
 *           node.value.value = value;
 *           this.moveToFront(node);
 *           return;
 *         }
 *
 *         // Check capacity
 *         if (this.list.length >= this.capacity) {
 *           // Delete the least recently used element (the tail of the linked list)
 *           const removedNode = this.list.tail;
 *           if (removedNode) {
 *             this.map.delete(removedNode.value.key);
 *             this.list.pop();
 *           }
 *         }
 *
 *         // Create new node and add to head
 *         const newEntry: CacheEntry<K, V> = { key, value };
 *         this.list.unshift(newEntry);
 *
 *         // Save node reference in map
 *         const newNode = this.list.head;
 *         if (newNode) {
 *           this.map.set(key, newNode);
 *         }
 *       }
 *
 *       // Delete specific key
 *       delete(key: K): boolean {
 *         const node = this.map.get(key);
 *         if (!node) return false;
 *
 *         // Remove from linked list
 *         this.list.delete(node);
 *         // Remove from map
 *         this.map.delete(key);
 *
 *         return true;
 *       }
 *
 *       // Clear cache
 *       clear(): void {
 *         this.list.clear();
 *         this.map.clear();
 *       }
 *
 *       // Move the node to the head of the linked list
 *       private moveToFront(node: DoublyLinkedListNode<CacheEntry<K, V>>): void {
 *         this.list.delete(node);
 *         this.list.unshift(node.value);
 *       }
 *     }
 *
 *     // should set and get values correctly
 *     const cache = new LRUCache<string, number>(3);
 *     cache.set('a', 1);
 *     cache.set('b', 2);
 *     cache.set('c', 3);
 *
 *     console.log(cache.get('a')); // 1
 *     console.log(cache.get('b')); // 2
 *     console.log(cache.get('c')); // 3
 *
 *     // The least recently used element should be evicted when capacity is exceeded
 *     cache.clear();
 *     cache.set('a', 1);
 *     cache.set('b', 2);
 *     cache.set('c', 3);
 *     cache.set('d', 4); // This will eliminate 'a'
 *
 *     console.log(cache.get('a')); // undefined
 *     console.log(cache.get('b')); // 2
 *     console.log(cache.get('c')); // 3
 *     console.log(cache.get('d')); // 4
 *
 *     // The priority of an element should be updated when it is accessed
 *     cache.clear();
 *     cache.set('a', 1);
 *     cache.set('b', 2);
 *     cache.set('c', 3);
 *
 *     cache.get('a'); // access 'a'
 *     cache.set('d', 4); // This will eliminate 'b'
 *
 *     console.log(cache.get('a')); // 1
 *     console.log(cache.get('b')); // undefined
 *     console.log(cache.get('c')); // 3
 *     console.log(cache.get('d')); // 4
 *
 *     // Should support updating existing keys
 *     cache.clear();
 *     cache.set('a', 1);
 *     cache.set('a', 10);
 *
 *     console.log(cache.get('a')); // 10
 *
 *     // Should support deleting specified keys
 *     cache.clear();
 *     cache.set('a', 1);
 *     cache.set('b', 2);
 *
 *     console.log(cache.delete('a')); // true
 *     console.log(cache.get('a')); // undefined
 *     console.log(cache.length); // 1
 *
 *     // Should support clearing cache
 *     cache.clear();
 *     cache.set('a', 1);
 *     cache.set('b', 2);
 *     cache.clear();
 *
 *     console.log(cache.length); // 0
 *     console.log(cache.isEmpty); // true
 * @example
 * // finding lyrics by timestamp in Coldplay's "Fix You"
 *     // Create a DoublyLinkedList to store song lyrics with timestamps
 *     const lyricsList = new DoublyLinkedList<{ time: number; text: string }>();
 *
 *     // Detailed lyrics with precise timestamps (in milliseconds)
 *     const lyrics = [
 *       { time: 0, text: "When you try your best, but you don't succeed" },
 *       { time: 4000, text: 'When you get what you want, but not what you need' },
 *       { time: 8000, text: "When you feel so tired, but you can't sleep" },
 *       { time: 12000, text: 'Stuck in reverse' },
 *       { time: 16000, text: 'And the tears come streaming down your face' },
 *       { time: 20000, text: "When you lose something you can't replace" },
 *       { time: 24000, text: 'When you love someone, but it goes to waste' },
 *       { time: 28000, text: 'Could it be worse?' },
 *       { time: 32000, text: 'Lights will guide you home' },
 *       { time: 36000, text: 'And ignite your bones' },
 *       { time: 40000, text: 'And I will try to fix you' }
 *     ];
 *
 *     // Populate the DoublyLinkedList with lyrics
 *     lyrics.forEach(lyric => lyricsList.push(lyric));
 *
 *     // Test different scenarios of lyric synchronization
 *
 *     // 1. Find lyric at exact timestamp
 *     const exactTimeLyric = lyricsList.getBackward(lyric => lyric.value.time <= 36000);
 *     console.log(exactTimeLyric?.text); // 'And ignite your bones'
 *
 *     // 2. Find lyric between timestamps
 *     const betweenTimeLyric = lyricsList.getBackward(lyric => lyric.value.time <= 22000);
 *     console.log(betweenTimeLyric?.text); // "When you lose something you can't replace"
 *
 *     // 3. Find first lyric when timestamp is less than first entry
 *     const earlyTimeLyric = lyricsList.getBackward(lyric => lyric.value.time <= -1000);
 *     console.log(earlyTimeLyric); // undefined
 *
 *     // 4. Find last lyric when timestamp is after last entry
 *     const lateTimeLyric = lyricsList.getBackward(lyric => lyric.value.time <= 50000);
 *     console.log(lateTimeLyric?.text); // 'And I will try to fix you'
 * @example
 * // cpu process schedules
 *     class Process {
 *       constructor(
 *         public id: number,
 *         public priority: number
 *       ) {}
 *
 *       execute(): string {
 *         return `Process ${this.id} executed.`;
 *       }
 *     }
 *
 *     class Scheduler {
 *       private queue: DoublyLinkedList<Process>;
 *
 *       constructor() {
 *         this.queue = new DoublyLinkedList<Process>();
 *       }
 *
 *       addProcess(process: Process): void {
 *         // Insert processes into a queue based on priority, keeping priority in descending order
 *         let current = this.queue.head;
 *         while (current && current.value.priority >= process.priority) {
 *           current = current.next;
 *         }
 *
 *         if (!current) {
 *           this.queue.push(process);
 *         } else {
 *           this.queue.addBefore(current, process);
 *         }
 *       }
 *
 *       executeNext(): string | undefined {
 *         // Execute tasks at the head of the queue in order
 *         const process = this.queue.shift();
 *         return process ? process.execute() : undefined;
 *       }
 *
 *       listProcesses(): string[] {
 *         return this.queue.toArray().map(process => `Process ${process.id} (Priority: ${process.priority})`);
 *       }
 *
 *       clear(): void {
 *         this.queue.clear();
 *       }
 *     }
 *
 *     // should add processes based on priority
 *     let scheduler = new Scheduler();
 *     scheduler.addProcess(new Process(1, 10));
 *     scheduler.addProcess(new Process(2, 20));
 *     scheduler.addProcess(new Process(3, 15));
 *
 *     console.log(scheduler.listProcesses()); // [
 *  //      'Process 2 (Priority: 20)',
 *  //      'Process 3 (Priority: 15)',
 *  //      'Process 1 (Priority: 10)'
 *  //    ]
 *
 *     // should execute the highest priority process
 *     scheduler = new Scheduler();
 *     scheduler.addProcess(new Process(1, 10));
 *     scheduler.addProcess(new Process(2, 20));
 *
 *     console.log(scheduler.executeNext()); // 'Process 2 executed.'
 *     console.log(scheduler.listProcesses()); // ['Process 1 (Priority: 10)']
 *
 *     // should clear all processes
 *     scheduler = new Scheduler();
 *     scheduler.addProcess(new Process(1, 10));
 *     scheduler.addProcess(new Process(2, 20));
 *
 *     scheduler.clear();
 *     console.log(scheduler.listProcesses()); // []
 */
export class DoublyLinkedList<E = any, R = any> extends LinearLinkedBase<E, R, DoublyLinkedListNode<E>> {
  protected _equals: (a: E, b: E) => boolean = Object.is as unknown as (a: E, b: E) => boolean;

  /**
   * Create a DoublyLinkedList and optionally bulk-insert elements.
   * @remarks Time O(N), Space O(N)
   * @param [elements] - Iterable of elements or nodes (or raw records if toElementFn is provided).
   * @param [options] - Options such as maxLen and toElementFn.
   * @returns New DoublyLinkedList instance.
   */

  constructor(
    elements: Iterable<E> | Iterable<R> | Iterable<DoublyLinkedListNode<E>> = [],
    options?: DoublyLinkedListOptions<E, R>
  ) {
    super(options);
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;

    if (options?.maxLen && Number.isInteger(options.maxLen) && options.maxLen > 0) {
      this._maxLen = options.maxLen;
    }

    this.pushMany(elements);
  }

  protected _head: DoublyLinkedListNode<E> | undefined;

  /**
   * Get the head node.
   * @remarks Time O(1), Space O(1)
   * @returns Head node or undefined.
   */

  get head(): DoublyLinkedListNode<E> | undefined {
    return this._head;
  }

  protected _tail: DoublyLinkedListNode<E> | undefined;

  /**
   * Get the tail node.
   * @remarks Time O(1), Space O(1)
   * @returns Tail node or undefined.
   */

  get tail(): DoublyLinkedListNode<E> | undefined {
    return this._tail;
  }

  protected _length = 0;

  /**
   * Get the number of elements.
   * @remarks Time O(1), Space O(1)
   * @returns Current length.
   */

  get length(): number {
    return this._length;
  }

  /**
   * Get the first element value.
   * @remarks Time O(1), Space O(1)
   * @returns First element or undefined.
   */

  get first(): E | undefined {
    return this.head?.value;
  }

  /**
   * Get the last element value.
   * @remarks Time O(1), Space O(1)
   * @returns Last element or undefined.
   */

  get last(): E | undefined {
    return this.tail?.value;
  }

  /**
   * Create a new list from an array of elements.
   * @remarks Time O(N), Space O(N)
   * @template E
   * @template R
   * @param this - The constructor (subclass) to instantiate.
   * @param data - Array of elements to insert.
   * @returns A new list populated with the array's elements.
   */

  static fromArray<E, R = any>(
    this: new (
      elements?: Iterable<E> | Iterable<R> | Iterable<DoublyLinkedListNode<E>>,
      options?: DoublyLinkedListOptions<E, R>
    ) => any,
    data: E[]
  ) {
    return new this(data);
  }

  /**
   * Type guard: check whether the input is a DoublyLinkedListNode.
   * @remarks Time O(1), Space O(1)
   * @param elementNodeOrPredicate - Element, node, or predicate.
   * @returns True if the value is a DoublyLinkedListNode.
   */

  isNode(
    elementNodeOrPredicate: E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)
  ): elementNodeOrPredicate is DoublyLinkedListNode<E> {
    return elementNodeOrPredicate instanceof DoublyLinkedListNode;
  }

  /**
   * Append an element/node to the tail.
   * @remarks Time O(1), Space O(1)
   * @param elementOrNode - Element or node to append.
   * @returns True when appended.
   */

  push(elementOrNode: E | DoublyLinkedListNode<E>): boolean {
    const newNode = this._ensureNode(elementOrNode);
    if (!this.head) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this._tail = newNode;
    }
    this._length++;
    if (this._maxLen > 0 && this.length > this._maxLen) this.shift();
    return true;
  }

  /**
   * Remove and return the tail element.
   * @remarks Time O(1), Space O(1)
   * @returns Removed element or undefined.
   */

  pop(): E | undefined {
    if (!this.tail) return undefined;
    const removed = this.tail;
    if (this.head === this.tail) {
      this._head = undefined;
      this._tail = undefined;
    } else {
      this._tail = removed.prev;
      this.tail!.next = undefined;
    }
    this._length--;
    return removed.value;
  }

  /**
   * Remove and return the head element.
   * @remarks Time O(1), Space O(1)
   * @returns Removed element or undefined.
   */

  shift(): E | undefined {
    if (!this.head) return undefined;
    const removed = this.head;
    if (this.head === this.tail) {
      this._head = undefined;
      this._tail = undefined;
    } else {
      this._head = removed.next;
      this.head!.prev = undefined;
    }
    this._length--;
    return removed.value;
  }

  /**
   * Prepend an element/node to the head.
   * @remarks Time O(1), Space O(1)
   * @param elementOrNode - Element or node to prepend.
   * @returns True when prepended.
   */

  unshift(elementOrNode: E | DoublyLinkedListNode<E>): boolean {
    const newNode = this._ensureNode(elementOrNode);
    if (!this.head) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      newNode.next = this.head;
      this.head!.prev = newNode;
      this._head = newNode;
    }
    this._length++;
    if (this._maxLen > 0 && this._length > this._maxLen) this.pop();
    return true;
  }

  /**
   * Append a sequence of elements/nodes.
   * @remarks Time O(N), Space O(1)
   * @param elements - Iterable of elements or nodes (or raw records if toElementFn is provided).
   * @returns Array of per-element success flags.
   */

  pushMany(elements: Iterable<E> | Iterable<R> | Iterable<DoublyLinkedListNode<E>>): boolean[] {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) ans.push(this.push(this.toElementFn(el as R)));
      else ans.push(this.push(el as E | DoublyLinkedListNode<E>));
    }
    return ans;
  }

  /**
   * Prepend a sequence of elements/nodes.
   * @remarks Time O(N), Space O(1)
   * @param elements - Iterable of elements or nodes (or raw records if toElementFn is provided).
   * @returns Array of per-element success flags.
   */

  unshiftMany(elements: Iterable<E> | Iterable<R> | Iterable<DoublyLinkedListNode<E>>): boolean[] {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) ans.push(this.unshift(this.toElementFn(el as R)));
      else ans.push(this.unshift(el as E | DoublyLinkedListNode<E>));
    }
    return ans;
  }

  /**
   * Get the element at a given index.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index.
   * @returns Element or undefined.
   */

  at(index: number): E | undefined {
    if (index < 0 || index >= this._length) return undefined;
    let current = this.head;
    for (let i = 0; i < index; i++) current = current!.next;
    return current!.value;
  }

  /**
   * Get the node reference at a given index.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index.
   * @returns Node or undefined.
   */

  getNodeAt(index: number): DoublyLinkedListNode<E> | undefined {
    if (index < 0 || index >= this._length) return undefined;
    let current = this.head;
    for (let i = 0; i < index; i++) current = current!.next;
    return current;
  }

  /**
   * Find a node by value, reference, or predicate.
   * @remarks Time O(N), Space O(1)
   * @param [elementNodeOrPredicate] - Element, node, or predicate to match.
   * @returns Matching node or undefined.
   */

  getNode(
    elementNodeOrPredicate: E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean) | undefined
  ): DoublyLinkedListNode<E> | undefined {
    if (elementNodeOrPredicate === undefined) return;

    if (this.isNode(elementNodeOrPredicate)) {
      const target = elementNodeOrPredicate;

      let cur = this.head;
      while (cur) {
        if (cur === target) return target;
        cur = cur.next;
      }

      const isMatch = (node: DoublyLinkedListNode<E>) => this._equals(node.value, target.value);
      cur = this.head;
      while (cur) {
        if (isMatch(cur)) return cur;
        cur = cur.next;
      }
      return undefined;
    }

    const predicate = this._ensurePredicate(elementNodeOrPredicate);
    let current = this.head;
    while (current) {
      if (predicate(current)) return current;
      current = current.next;
    }
    return undefined;
  }

  /**
   * Insert a new element/node at an index, shifting following nodes.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index.
   * @param newElementOrNode - Element or node to insert.
   * @returns True if inserted.
   */

  addAt(index: number, newElementOrNode: E | DoublyLinkedListNode<E>): boolean {
    if (index < 0 || index > this._length) return false;
    if (index === 0) return this.unshift(newElementOrNode);
    if (index === this._length) return this.push(newElementOrNode);

    const newNode = this._ensureNode(newElementOrNode);
    const prevNode = this.getNodeAt(index - 1)!;
    const nextNode = prevNode.next!;
    newNode.prev = prevNode;
    newNode.next = nextNode;
    prevNode.next = newNode;
    nextNode.prev = newNode;
    this._length++;
    return true;
  }

  /**
   * Insert a new element/node before an existing one.
   * @remarks Time O(N), Space O(1)
   * @param existingElementOrNode - Existing element or node.
   * @param newElementOrNode - Element or node to insert.
   * @returns True if inserted.
   */

  addBefore(
    existingElementOrNode: E | DoublyLinkedListNode<E>,
    newElementOrNode: E | DoublyLinkedListNode<E>
  ): boolean {
    const existingNode = this.isNode(existingElementOrNode)
      ? existingElementOrNode
      : this.getNode(existingElementOrNode);
    if (!existingNode) return false;

    const newNode = this._ensureNode(newElementOrNode);
    newNode.prev = existingNode.prev;
    if (existingNode.prev) existingNode.prev.next = newNode;
    newNode.next = existingNode;
    existingNode.prev = newNode;
    if (existingNode === this.head) this._head = newNode;
    this._length++;
    return true;
  }

  /**
   * Insert a new element/node after an existing one.
   * @remarks Time O(N), Space O(1)
   * @param existingElementOrNode - Existing element or node.
   * @param newElementOrNode - Element or node to insert.
   * @returns True if inserted.
   */

  addAfter(existingElementOrNode: E | DoublyLinkedListNode<E>, newElementOrNode: E | DoublyLinkedListNode<E>): boolean {
    const existingNode = this.isNode(existingElementOrNode)
      ? existingElementOrNode
      : this.getNode(existingElementOrNode);
    if (!existingNode) return false;

    const newNode = this._ensureNode(newElementOrNode);
    newNode.next = existingNode.next;
    if (existingNode.next) existingNode.next.prev = newNode;
    newNode.prev = existingNode;
    existingNode.next = newNode;
    if (existingNode === this.tail) this._tail = newNode;
    this._length++;
    return true;
  }

  /**
   * Set the element value at an index.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index.
   * @param value - New value.
   * @returns True if updated.
   */

  setAt(index: number, value: E): boolean {
    const node = this.getNodeAt(index);
    if (!node) return false;
    node.value = value;
    return true;
  }

  /**
   * Delete the element at an index.
   * @remarks Time O(N), Space O(1)
   * @param index - Zero-based index.
   * @returns Removed element or undefined.
   */

  deleteAt(index: number): E | undefined {
    if (index < 0 || index >= this._length) return;
    if (index === 0) return this.shift();
    if (index === this._length - 1) return this.pop();

    const removedNode = this.getNodeAt(index)!;
    const prevNode = removedNode.prev!;
    const nextNode = removedNode.next!;
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
    this._length--;
    return removedNode.value;
  }

  /**
   * Delete the first match by value/node.
   * @remarks Time O(N), Space O(1)
   * @param [elementOrNode] - Element or node to remove.
   * @returns True if removed.
   */

  delete(elementOrNode: E | DoublyLinkedListNode<E> | undefined): boolean {
    const node = this.getNode(elementOrNode);
    if (!node) return false;

    if (node === this.head) this.shift();
    else if (node === this.tail) this.pop();
    else {
      const prevNode = node.prev!;
      const nextNode = node.next!;
      prevNode.next = nextNode;
      nextNode.prev = prevNode;
      this._length--;
    }
    return true;
  }

  /**
   * Check whether the list is empty.
   * @remarks Time O(1), Space O(1)
   * @returns True if length is 0.
   */

  isEmpty(): boolean {
    return this._length === 0;
  }

  /**
   * Remove all nodes and reset length.
   * @remarks Time O(N), Space O(1)
   * @returns void
   */

  clear(): void {
    this._head = undefined;
    this._tail = undefined;
    this._length = 0;
  }

  /**
   * Find the first value matching a predicate scanning forward.
   * @remarks Time O(N), Space O(1)
   * @param elementNodeOrPredicate - Element, node, or predicate to match.
   * @returns Matched value or undefined.
   */

  search(
    elementNodeOrPredicate: E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)
  ): E | undefined {
    const predicate = this._ensurePredicate(elementNodeOrPredicate);
    let current = this.head;
    while (current) {
      if (predicate(current)) return current.value;
      current = current.next;
    }
    return undefined;
  }

  /**
   * Find the first value matching a predicate scanning backward.
   * @remarks Time O(N), Space O(1)
   * @param elementNodeOrPredicate - Element, node, or predicate to match.
   * @returns Matched value or undefined.
   */

  getBackward(
    elementNodeOrPredicate: E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)
  ): E | undefined {
    const predicate = this._ensurePredicate(elementNodeOrPredicate);
    let current = this.tail;
    while (current) {
      if (predicate(current)) return current.value;
      current = current.prev;
    }
    return undefined;
  }

  /**
   * Reverse the list in place.
   * @remarks Time O(N), Space O(1)
   * @returns This list.
   */

  reverse(): this {
    let current = this.head;
    [this._head, this._tail] = [this.tail, this.head];
    while (current) {
      const next = current.next;
      [current.prev, current.next] = [current.next, current.prev];
      current = next;
    }
    return this;
  }

  /**
   * Set the equality comparator used to compare values.
   * @remarks Time O(1), Space O(1)
   * @param equals - Equality predicate (a, b) → boolean.
   * @returns This list.
   */

  setEquality(equals: (a: E, b: E) => boolean): this {
    this._equals = equals;
    return this;
  }

  /**
   * Deep clone this list (values are copied by reference).
   * @remarks Time O(N), Space O(N)
   * @returns A new list with the same element sequence.
   */

  clone(): this {
    const out = this._createInstance({ toElementFn: this._toElementFn, maxLen: this._maxLen });
    for (const v of this) out.push(v);
    return out;
  }

  /**
   * Filter values into a new list of the same class.
   * @remarks Time O(N), Space O(N)
   * @param callback - Predicate (value, index, list) → boolean to keep value.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new list with kept values.
   */

  filter(callback: ElementCallback<E, R, boolean>, thisArg?: any): this {
    const out = this._createInstance({ toElementFn: this._toElementFn, maxLen: this._maxLen });
    let index = 0;
    for (const v of this) if (callback.call(thisArg, v, index++, this)) out.push(v);
    return out;
  }

  /**
   * Map values into a new list of the same class.
   * @remarks Time O(N), Space O(N)
   * @param callback - Mapping function (value, index, list) → newValue.
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new list with mapped values.
   */

  mapSame(callback: ElementCallback<E, R, E>, thisArg?: any): this {
    const out = this._createInstance({ toElementFn: this._toElementFn, maxLen: this._maxLen });
    let index = 0;
    for (const v of this) {
      const mv = thisArg === undefined ? callback(v, index++, this) : callback.call(thisArg, v, index++, this);
      out.push(mv);
    }
    return out;
  }

  /**
   * Map values into a new list (possibly different element type).
   * @remarks Time O(N), Space O(N)
   * @template EM
   * @template RM
   * @param callback - Mapping function (value, index, list) → newElement.
   * @param [options] - Options for the output list (e.g., maxLen, toElementFn).
   * @param [thisArg] - Value for `this` inside the callback.
   * @returns A new DoublyLinkedList with mapped values.
   */

  map<EM, RM>(
    callback: ElementCallback<E, R, EM>,
    options?: DoublyLinkedListOptions<EM, RM>,
    thisArg?: any
  ): DoublyLinkedList<EM, RM> {
    const out = this._createLike<EM, RM>([], { ...(options ?? {}), maxLen: this._maxLen });
    let index = 0;
    for (const v of this) out.push(callback.call(thisArg, v, index++, this));
    return out;
  }

  /**
   * (Protected) Create or return a node for the given input (node or raw element).
   * @remarks Time O(1), Space O(1)
   * @param elementOrNode - Element value or node to normalize.
   * @returns A DoublyLinkedListNode for the provided input.
   */

  protected _ensureNode(elementOrNode: E | DoublyLinkedListNode<E>) {
    if (this.isNode(elementOrNode)) return elementOrNode;
    return new DoublyLinkedListNode<E>(elementOrNode);
  }

  /**
   * (Protected) Normalize input into a predicate over nodes.
   * @remarks Time O(1), Space O(1)
   * @param elementNodeOrPredicate - Element, node, or node predicate.
   * @returns A predicate function taking a node and returning true/false.
   */

  protected _ensurePredicate(
    elementNodeOrPredicate: E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)
  ): (node: DoublyLinkedListNode<E>) => boolean {
    if (this.isNode(elementNodeOrPredicate)) {
      const target = elementNodeOrPredicate;
      return (node: DoublyLinkedListNode<E>) => node === target;
    }
    if (typeof elementNodeOrPredicate === 'function') {
      return elementNodeOrPredicate as (node: DoublyLinkedListNode<E>) => boolean;
    }
    const value = elementNodeOrPredicate as E;
    return (node: DoublyLinkedListNode<E>) => this._equals(node.value, value);
  }

  /**
   * (Protected) Get the previous node of a given node.
   * @remarks Time O(1), Space O(1)
   * @param node - A node in the list.
   * @returns Previous node or undefined.
   */

  protected _getPrevNode(node: DoublyLinkedListNode<E>): DoublyLinkedListNode<E> | undefined {
    return node.prev;
  }

  /**
   * (Protected) Create an empty instance of the same concrete class.
   * @remarks Time O(1), Space O(1)
   * @param [options] - Options forwarded to the constructor.
   * @returns An empty like-kind list instance.
   */

  protected override _createInstance(options?: LinearBaseOptions<E, R>): this {
    const Ctor = this.constructor as new (
      elements?: Iterable<E> | Iterable<R> | Iterable<DoublyLinkedListNode<E>>,
      options?: DoublyLinkedListOptions<E, R>
    ) => this;
    return new Ctor([], options as DoublyLinkedListOptions<E, R> | undefined);
  }

  /**
   * (Protected) Create a like-kind instance and seed it from an iterable.
   * @remarks Time O(N), Space O(N)
   * @template EM
   * @template RM
   * @param [elements] - Iterable used to seed the new list.
   * @param [options] - Options forwarded to the constructor.
   * @returns A like-kind DoublyLinkedList instance.
   */

  protected _createLike<EM = E, RM = R>(
    elements: Iterable<EM> | Iterable<RM> | Iterable<DoublyLinkedListNode<EM>> = [],
    options?: DoublyLinkedListOptions<EM, RM>
  ): DoublyLinkedList<EM, RM> {
    const Ctor = this.constructor as new (
      elements?: Iterable<EM> | Iterable<RM> | Iterable<DoublyLinkedListNode<EM>>,
      options?: DoublyLinkedListOptions<EM, RM>
    ) => DoublyLinkedList<EM, RM>;
    return new Ctor(elements, options);
  }

  protected *_getIterator(): IterableIterator<E> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }

  protected *_getReverseIterator(): IterableIterator<E> {
    let current = this.tail;
    while (current) {
      yield current.value;
      current = current.prev;
    }
  }

  protected *_getNodeIterator(): IterableIterator<DoublyLinkedListNode<E>> {
    let current = this.head;
    while (current) {
      yield current;
      current = current.next;
    }
  }
}

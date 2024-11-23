/**
 * data-structure-typed
 *
 * @author Pablo Zeng
 * @copyright Copyright (c) 2022 Pablo Zeng <zrwusa@gmail.com>
 * @license MIT License
 */
import type { DoublyLinkedListOptions, ElementCallback } from '../../types';
import { IterableElementBase } from '../base';

export class DoublyLinkedListNode<E = any> {
  /**
   * The constructor function initializes the value, next, and previous properties of an object.
   * @param {E} value - The "value" parameter is the value that will be stored in the node. It can be of any data type, as it
   * is defined as a generic type "E".
   */
  constructor(value: E) {
    this._value = value;
    this._next = undefined;
    this._prev = undefined;
  }

  protected _value: E;

  /**
   * The function returns the value of a protected variable.
   * @returns The value of the variable `_value` is being returned.
   */
  get value(): E {
    return this._value;
  }

  /**
   * The above function sets the value of a variable.
   * @param {E} value - The parameter "value" is of type E, which means it can be any type.
   */
  set value(value: E) {
    this._value = value;
  }

  protected _next: DoublyLinkedListNode<E> | undefined;

  /**
   * The "next" function returns the next node in a doubly linked list.
   * @returns The `next` property is being returned. It can be either a `DoublyLinkedListNode<E>`
   * object or `undefined`.
   */
  get next(): DoublyLinkedListNode<E> | undefined {
    return this._next;
  }

  /**
   * The "next" property of a DoublyLinkedListNode is set to the provided value.
   * @param {DoublyLinkedListNode<E> | undefined} value - The `value` parameter is of type
   * `DoublyLinkedListNode<E> | undefined`. This means that it can accept either a
   * `DoublyLinkedListNode` object or `undefined` as its value.
   */
  set next(value: DoublyLinkedListNode<E> | undefined) {
    this._next = value;
  }

  protected _prev: DoublyLinkedListNode<E> | undefined;

  /**
   * The `prev` function returns the previous node in a doubly linked list.
   * @returns The `prev` property of the `DoublyLinkedListNode` class is being returned. It can either
   * be a `DoublyLinkedListNode` object or `undefined`.
   */
  get prev(): DoublyLinkedListNode<E> | undefined {
    return this._prev;
  }

  /**
   * The function sets the previous node of a doubly linked list node.
   * @param {DoublyLinkedListNode<E> | undefined} value - The `value` parameter is of type
   * `DoublyLinkedListNode<E> | undefined`. This means that it can accept either a
   * `DoublyLinkedListNode` object or `undefined` as its value.
   */
  set prev(value: DoublyLinkedListNode<E> | undefined) {
    this._prev = value;
  }
}

/**
 *1. Node Structure: Each node contains three parts: a data field, a pointer (or reference) to the previous node, and a pointer to the next node. This structure allows traversal of the linked list in both directions.
 * 2. Bidirectional Traversal: Unlike singly linked lists, doubly linked lists can be easily traversed forwards or backwards. This makes insertions and deletions in the list more flexible and efficient.
 * 3. No Centralized Index: Unlike arrays, elements in a linked list are not stored contiguously, so there is no centralized index. Accessing elements in a linked list typically requires traversing from the head or tail node.
 * 4. High Efficiency in Insertion and Deletion: Adding or removing elements in a linked list does not require moving other elements, making these operations more efficient than in arrays.
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
 *         for (let i = 0; i < this.playlist.size * 2; i++) {
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
 *         if (this.list.size >= this.capacity) {
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
 *       // Move the node to the head of the linked list
 *       private moveToFront(node: DoublyLinkedListNode<CacheEntry<K, V>>): void {
 *         this.list.delete(node);
 *         this.list.unshift(node.value);
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
 *       // Get the current cache size
 *       get size(): number {
 *         return this.list.size;
 *       }
 *
 *       // Check if it is empty
 *       get isEmpty(): boolean {
 *         return this.list.isEmpty();
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
 *     console.log(cache.size); // 1
 *
 *     // Should support clearing cache
 *     cache.clear();
 *     cache.set('a', 1);
 *     cache.set('b', 2);
 *     cache.clear();
 *
 *     console.log(cache.size); // 0
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
export class DoublyLinkedList<E = any, R = any> extends IterableElementBase<E, R, DoublyLinkedList<E, R>> {
  /**
   * This TypeScript constructor initializes a DoublyLinkedList with optional elements and options.
   * @param {Iterable<E> | Iterable<R>} elements - The `elements` parameter in the constructor is an
   * iterable collection of elements of type `E` or `R`. It is used to initialize the DoublyLinkedList
   * with the elements provided in the iterable. If no elements are provided, the default value is an
   * empty iterable.
   * @param [options] - The `options` parameter in the constructor is of type
   * `DoublyLinkedListOptions<E, R>`. It is an optional parameter that allows you to pass additional
   * configuration options to customize the behavior of the DoublyLinkedList.
   */
  constructor(
    elements: Iterable<E> | Iterable<R> | Iterable<DoublyLinkedListNode<E>> = [],
    options?: DoublyLinkedListOptions<E, R>
  ) {
    super(options);
    this._head = undefined;
    this._tail = undefined;
    this._size = 0;
    this.pushMany(elements);
  }

  protected _head: DoublyLinkedListNode<E> | undefined;

  /**
   * The `head` function returns the first node of a doubly linked list.
   * @returns The method `getHead()` returns either a `DoublyLinkedListNode<E>` object or `undefined`.
   */
  get head(): DoublyLinkedListNode<E> | undefined {
    return this._head;
  }

  protected _tail: DoublyLinkedListNode<E> | undefined;

  /**
   * The `tail` function returns the last node of a doubly linked list.
   * @returns The `get tail()` method is returning either a `DoublyLinkedListNode<E>` object or
   * `undefined`.
   */
  get tail(): DoublyLinkedListNode<E> | undefined {
    return this._tail;
  }

  protected _size: number;

  /**
   * The function returns the size of an object.
   * @returns The size of the object, which is a number.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `get first` function returns the first node in a doubly linked list, or undefined if the list is empty.
   * @returns The method `get first()` returns the first node of the doubly linked list, or `undefined` if the list is empty.
   */
  get first(): E | undefined {
    return this.head?.value;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `get last` function returns the last node in a doubly linked list, or undefined if the list is empty.
   * @returns The method `get last()` returns the last node of the doubly linked list, or `undefined` if the list is empty.
   */
  get last(): E | undefined {
    return this.tail?.value;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function `isNode` in TypeScript checks if a given input is an instance of
   * `DoublyLinkedListNode`.
   * @param {E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)} elementNodeOrPredicate
   * elementNodeOrPredicate - The `elementNodeOrPredicate` parameter in the `isNode` function can
   * be one of the following types:
   * @returns The `isNode` function is checking if the `elementNodeOrPredicate` parameter is an
   * instance of `DoublyLinkedListNode<E>`. If it is, the function returns `true`, indicating that the
   * parameter is a `DoublyLinkedListNode<E>`. If it is not an instance of `DoublyLinkedListNode<E>`,
   * the function returns `false`.
   */
  isNode(
    elementNodeOrPredicate: E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)
  ): elementNodeOrPredicate is DoublyLinkedListNode<E> {
    return elementNodeOrPredicate instanceof DoublyLinkedListNode;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `push` function adds a new element or node to the end of a doubly linked list.
   * @param {E | DoublyLinkedListNode<E>} elementOrNode - The `elementOrNode` parameter in the `push`
   * method can accept either an element of type `E` or a `DoublyLinkedListNode<E>` object.
   * @returns The `push` method is returning a boolean value, specifically `true`.
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
    this._size++;
    return true;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `pop()` function removes and returns the value of the last element in a linked list.
   * @returns The method is returning the value of the removed node.
   */
  pop(): E | undefined {
    if (!this.tail) return undefined;
    const removedNode = this.tail;
    if (this.head === this.tail) {
      this._head = undefined;
      this._tail = undefined;
    } else {
      this._tail = removedNode.prev;
      this.tail!.next = undefined;
    }
    this._size--;
    return removedNode.value;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `shift()` function removes and returns the value of the first element in a doubly linked list.
   * @returns The value of the removed node.
   */
  shift(): E | undefined {
    if (!this.head) return undefined;
    const removedNode = this.head;
    if (this.head === this.tail) {
      this._head = undefined;
      this._tail = undefined;
    } else {
      this._head = removedNode.next;
      this.head!.prev = undefined;
    }
    this._size--;
    return removedNode.value;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The unshift function adds a new element or node to the beginning of a doubly linked list.
   * @param {E | DoublyLinkedListNode<E>} elementOrNode - The `elementOrNode` parameter in the
   * `unshift` method can be either an element of type `E` or a `DoublyLinkedListNode` containing an
   * element of type `E`.
   * @returns The `unshift` method is returning a boolean value, specifically `true`.
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
    this._size++;
    return true;
  }

  /**
   * Time Complexity: O(k)
   * Space Complexity: O(k)
   *
   * The function `pushMany` iterates over elements and pushes them into a data structure, applying a
   * transformation function if provided.
   * @param {Iterable<E> | Iterable<R> | Iterable<DoublyLinkedListNode<E>>} elements - The `elements`
   * parameter in the `pushMany` function can accept an iterable containing elements of type `E`, `R`,
   * or `DoublyLinkedListNode<E>`. The function iterates over each element in the iterable and pushes
   * it onto the linked list. If a transformation function `to
   * @returns The `pushMany` function is returning an array of boolean values (`ans`) which indicate
   * the success or failure of pushing each element into the data structure.
   */
  pushMany(elements: Iterable<E> | Iterable<R> | Iterable<DoublyLinkedListNode<E>>) {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) {
        ans.push(this.push(this.toElementFn(el as R)));
        continue;
      }
      ans.push(this.push(el as E | DoublyLinkedListNode<E>));
    }
    return ans;
  }

  /**
   * Time Complexity: O(k)
   * Space Complexity: O(k)
   *
   * The function `unshiftMany` iterates through a collection of elements and adds them to the
   * beginning of a Doubly Linked List, returning an array of boolean values indicating the success of
   * each insertion.
   * @param {Iterable<E> | Iterable<R> | Iterable<DoublyLinkedListNode<E>>} elements - The `elements`
   * parameter in the `unshiftMany` function can accept an iterable containing elements of type `E`,
   * `R`, or `DoublyLinkedListNode<E>`. The function iterates over each element in the iterable and
   * performs an `unshift` operation on the doubly linked list
   * @returns The `unshiftMany` function returns an array of boolean values indicating the success of
   * each unshift operation performed on the elements passed as input.
   */
  unshiftMany(elements: Iterable<E> | Iterable<R> | Iterable<DoublyLinkedListNode<E>>) {
    const ans: boolean[] = [];
    for (const el of elements) {
      if (this.toElementFn) {
        ans.push(this.unshift(this.toElementFn(el as R)));
        continue;
      }
      ans.push(this.unshift(el as E | DoublyLinkedListNode<E>));
    }
    return ans;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `at` function returns the value at a specified index in a linked list, or undefined if the index is out of bounds.
   * @param {number} index - The index parameter is a number that represents the position of the element we want to
   * retrieve from the list.
   * @returns The method is returning the value at the specified index in the linked list. If the index is out of bounds
   * or the linked list is empty, it will return undefined.
   */
  at(index: number): E | undefined {
    if (index < 0 || index >= this._size) return undefined;
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }
    return current!.value;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `getNodeAt` returns the node at a given index in a doubly linked list, or undefined if the index is out of
   * range.
   * @param {number} index - The `index` parameter is a number that represents the position of the node we want to
   * retrieve from the doubly linked list. It indicates the zero-based index of the node we want to access.
   * @returns The method `getNodeAt(index: number)` returns a `DoublyLinkedListNode<E>` object if the index is within the
   * valid range of the linked list, otherwise it returns `undefined`.
   */
  getNodeAt(index: number): DoublyLinkedListNode<E> | undefined {
    if (index < 0 || index >= this._size) return undefined;
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }
    return current;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * This TypeScript function searches for a node in a doubly linked list based on a given element node
   * or predicate.
   * @param {| E
   *       | DoublyLinkedListNode<E>
   *       | ((node: DoublyLinkedListNode<E>) => boolean)
   *       | undefined} elementNodeOrPredicate - The `getNode` method you provided is used to find a
   * node in a doubly linked list based on a given element, node, or predicate function. The
   * `elementNodeOrPredicate` parameter can be one of the following:
   * @returns The `getNode` method returns a `DoublyLinkedListNode<E>` or `undefined` based on the
   * input `elementNodeOrPredicate`. If the input is `undefined`, the method returns `undefined`.
   * Otherwise, it iterates through the linked list starting from the head node and applies the
   * provided predicate function to each node. If a node satisfies the predicate, that node is
   * returned. If
   */
  getNode(
    elementNodeOrPredicate: E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean) | undefined
  ): DoublyLinkedListNode<E> | undefined {
    if (elementNodeOrPredicate === undefined) return;
    const predicate = this._ensurePredicate(elementNodeOrPredicate);
    let current = this.head;

    while (current) {
      if (predicate(current)) {
        return current;
      }
      current = current.next;
    }

    return undefined;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `addAt` function inserts a new element or node at a specified index in a doubly linked list.
   * @param {number} index - The `index` parameter in the `addAt` method represents the position at
   * which you want to add a new element or node in the doubly linked list. It indicates the location
   * where the new element or node should be inserted.
   * @param {E | DoublyLinkedListNode<E>} newElementOrNode - The `newElementOrNode` parameter in the
   * `addAt` method can be either a value of type `E` or a `DoublyLinkedListNode<E>` object.
   * @returns The `addAt` method returns a boolean value. It returns `true` if the element or node was
   * successfully added at the specified index, and `false` if the index is out of bounds (less than 0
   * or greater than the size of the list).
   */
  addAt(index: number, newElementOrNode: E | DoublyLinkedListNode<E>): boolean {
    if (index < 0 || index > this._size) return false;
    if (index === 0) {
      this.unshift(newElementOrNode);
      return true;
    }
    if (index === this._size) {
      this.push(newElementOrNode);
      return true;
    }

    const newNode = this._ensureNode(newElementOrNode);
    const prevNode = this.getNodeAt(index - 1);
    const nextNode = prevNode!.next;
    newNode.prev = prevNode;
    newNode.next = nextNode;
    prevNode!.next = newNode;
    nextNode!.prev = newNode;
    this._size++;
    return true;
  }

  /**
   * Time Complexity: O(1) or O(n)
   * Space Complexity: O(1)
   *
   * The `addBefore` function in TypeScript adds a new element or node before an existing element or
   * node in a doubly linked list.
   * @param {E | DoublyLinkedListNode<E>} existingElementOrNode - The `existingElementOrNode` parameter
   * in the `addBefore` method can be either an element of type `E` or a `DoublyLinkedListNode<E>`.
   * @param {E | DoublyLinkedListNode<E>} newElementOrNode - The `newElementOrNode` parameter
   * represents the element or node that you want to add before the `existingElementOrNode` in a doubly
   * linked list.
   * @returns The `addBefore` method returns a boolean value - `true` if the new element or node was
   * successfully added before the existing element or node, and `false` if the existing element or
   * node was not found.
   */
  addBefore(
    existingElementOrNode: E | DoublyLinkedListNode<E>,
    newElementOrNode: E | DoublyLinkedListNode<E>
  ): boolean {
    const existingNode: DoublyLinkedListNode<E> | undefined = this.isNode(existingElementOrNode)
      ? existingElementOrNode
      : this.getNode(existingElementOrNode);

    if (existingNode) {
      const newNode = this._ensureNode(newElementOrNode);
      newNode.prev = existingNode.prev;
      if (existingNode.prev) {
        existingNode.prev.next = newNode;
      }
      newNode.next = existingNode;
      existingNode.prev = newNode;
      if (existingNode === this.head) {
        this._head = newNode;
      }
      this._size++;
      return true;
    }

    return false;
  }

  /**
   * Time Complexity: O(1) or O(n)
   * Space Complexity: O(1)
   *
   * The `addAfter` function in TypeScript adds a new element or node after an existing element or node
   * in a doubly linked list.
   * @param {E | DoublyLinkedListNode<E>} existingElementOrNode - existingElementOrNode represents the
   * element or node in the doubly linked list after which you want to add a new element or node.
   * @param {E | DoublyLinkedListNode<E>} newElementOrNode - The `newElementOrNode` parameter in the
   * `addAfter` method represents the element or node that you want to add after the existing element
   * or node in a doubly linked list. This parameter can be either an element value or a
   * `DoublyLinkedListNode` object that you want to insert
   * @returns The `addAfter` method returns a boolean value - `true` if the new element or node was
   * successfully added after the existing element or node, and `false` if the existing element or node
   * was not found in the linked list.
   */
  addAfter(existingElementOrNode: E | DoublyLinkedListNode<E>, newElementOrNode: E | DoublyLinkedListNode<E>): boolean {
    const existingNode: DoublyLinkedListNode<E> | undefined = this.isNode(existingElementOrNode)
      ? existingElementOrNode
      : this.getNode(existingElementOrNode);

    if (existingNode) {
      const newNode = this._ensureNode(newElementOrNode);
      newNode.next = existingNode.next;
      if (existingNode.next) {
        existingNode.next.prev = newNode;
      }
      newNode.prev = existingNode;
      existingNode.next = newNode;
      if (existingNode === this.tail) {
        this._tail = newNode;
      }
      this._size++;
      return true;
    }

    return false;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `deleteAt` function removes an element at a specified index from a linked list and returns the removed element.
   * @param {number} index - The index parameter represents the position of the element that needs to be deleted in the
   * data structure. It is of type number.
   * @returns The method `deleteAt` returns the value of the node that was deleted, or `undefined` if the index is out of
   * bounds.
   */
  deleteAt(index: number): boolean {
    if (index < 0 || index >= this._size) return false;
    if (index === 0) {
      this.shift();
      return true;
    }
    if (index === this._size - 1) {
      this.pop();
      return true;
    }

    const removedNode = this.getNodeAt(index);
    const prevNode = removedNode!.prev;
    const nextNode = removedNode!.next;
    prevNode!.next = nextNode;
    nextNode!.prev = prevNode;
    this._size--;
    return true;
  }

  /**
   * Time Complexity: O(1) or O(n)
   * Space Complexity: O(1)
   *
   * The `delete` function removes a specified element or node from a doubly linked list if it exists.
   * @param {E | DoublyLinkedListNode<E> | undefined} elementOrNode - The `elementOrNode` parameter in
   * the `delete` method can accept an element of type `E`, a `DoublyLinkedListNode` of type `E`, or it
   * can be `undefined`. This parameter is used to identify the node that needs to be deleted from the
   * doubly linked list
   * @returns The `delete` method returns a boolean value - `true` if the element or node was
   * successfully deleted from the doubly linked list, and `false` if the element or node was not found
   * in the list.
   */
  delete(elementOrNode: E | DoublyLinkedListNode<E> | undefined): boolean {
    const node: DoublyLinkedListNode<E> | undefined = this.getNode(elementOrNode);

    if (node) {
      if (node === this.head) {
        this.shift();
      } else if (node === this.tail) {
        this.pop();
      } else {
        const prevNode = node.prev;
        const nextNode = node.next;
        if (prevNode) prevNode.next = nextNode;
        if (nextNode) nextNode.prev = prevNode;
        this._size--;
      }
      return true;
    }
    return false;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The function checks if a variable has a size greater than zero and returns a boolean value.
   * @returns A boolean value is being returned.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The `clear` function resets the linked list by setting the head, tail, and size to undefined and 0 respectively.
   */
  clear(): void {
    this._head = undefined;
    this._tail = undefined;
    this._size = 0;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * This function finds the index of a specified element, node, or predicate in a doubly linked list.
   * @param {E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)} elementNodeOrPredicate
   * elementNodeOrPredicate - The `indexOf` method takes in a parameter `elementNodeOrPredicate`, which
   * can be one of the following:
   * @returns The `indexOf` method returns the index of the element in the doubly linked list that
   * matches the provided element, node, or predicate. If no match is found, it returns -1.
   */
  indexOf(elementNodeOrPredicate: E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)): number {
    const predicate = this._ensurePredicate(elementNodeOrPredicate);
    let index = 0;
    let current = this.head;
    while (current) {
      if (predicate(current)) {
        return index;
      }
      index++;
      current = current.next;
    }
    return -1;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * This function retrieves an element from a doubly linked list based on a given element
   * node or predicate.
   * @param {E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)} elementNodeOrPredicate
   * elementNodeOrPredicate - The `get` method takes in a parameter called `elementNodeOrPredicate`,
   * which can be one of the following types:
   * @returns The `get` method returns the value of the first node in the doubly linked list that
   * satisfies the provided predicate function. If no such node is found, it returns `undefined`.
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
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `getBackward` function searches for a specific element in a doubly linked list starting from
   * the tail and moving backwards.
   * @param {E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)} elementNodeOrPredicate
   * elementNodeOrPredicate - The `elementNodeOrPredicate` parameter in the `getBackward`
   * function can be one of the following types:
   * @returns The `getBackward` method returns the value of the element node that matches the provided
   * predicate when traversing the doubly linked list backwards. If no matching element is found, it
   * returns `undefined`.
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
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The `reverse` function reverses the order of the elements in a doubly linked list.
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
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `toArray` function converts a linked list into an array.
   * @returns The `toArray()` method is returning an array of type `E[]`.
   */
  toArray(): E[] {
    const array: E[] = [];
    let current = this.head;
    while (current) {
      array.push(current.value);
      current = current.next;
    }
    return array;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `toReversedArray` function converts a doubly linked list into an array in reverse order.
   * @returns The `toReversedArray()` function returns an array of type `E[]`.
   */
  toReversedArray(): E[] {
    const array: E[] = [];
    let current = this.tail;
    while (current) {
      array.push(current.value);
      current = current.prev;
    }
    return array;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `clone` function creates a new instance of the `DoublyLinkedList` class with the same values
   * as the original list.
   * @returns The `clone()` method is returning a new instance of the `DoublyLinkedList` class, which
   * is a copy of the original list.
   */
  clone(): DoublyLinkedList<E, R> {
    return new DoublyLinkedList<E, R>(this);
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `filter` function creates a new DoublyLinkedList by iterating over the elements of the current
   * list and applying a callback function to each element, returning only the elements for which the
   * callback function returns true.
   * @param callback - The `callback` parameter is a function that will be called for each element in
   * the DoublyLinkedList. It takes three arguments: the current element, the index of the current
   * element, and the DoublyLinkedList itself. The callback function should return a boolean value
   * indicating whether the current element should be included
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that specifies the value
   * to be used as `this` when executing the `callback` function. If `thisArg` is provided, it will be
   * passed as the `this` value to the `callback` function. If `thisArg` is
   * @returns The `filter` method is returning a new `DoublyLinkedList` object that contains the
   * elements that pass the filter condition specified by the `callback` function.
   */
  filter(callback: ElementCallback<E, R, boolean, DoublyLinkedList<E, R>>, thisArg?: any): DoublyLinkedList<E, R> {
    const filteredList = new DoublyLinkedList<E, R>([], { toElementFn: this.toElementFn });
    let index = 0;
    for (const current of this) {
      if (callback.call(thisArg, current, index, this)) {
        filteredList.push(current);
      }
      index++;
    }
    return filteredList;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `map` function takes a callback function and returns a new DoublyLinkedList with the results
   * of applying the callback to each element in the original list.
   * @param callback - The callback parameter is a function that will be called for each element in the
   * original DoublyLinkedList. It takes three arguments: current (the current element being
   * processed), index (the index of the current element), and this (the original DoublyLinkedList).
   * The callback function should return a value of type
   * @param [toElementFn] - The `toElementFn` parameter is an optional function that can be used to
   * convert the raw element (`RR`) to the desired element type (`T`). It takes the raw element as
   * input and returns the converted element. If this parameter is not provided, the raw element will
   * be used as is.
   * @param {any} [thisArg] - The `thisArg` parameter is an optional argument that allows you to
   * specify the value of `this` within the callback function. It is used to set the context or scope
   * in which the callback function will be executed. If `thisArg` is provided, it will be used as the
   * value of
   * @returns a new instance of the `DoublyLinkedList` class with elements of type `T` and `RR`.
   */
  map<EM, RM>(
    callback: ElementCallback<E, R, EM, DoublyLinkedList<E, R>>,
    toElementFn?: (rawElement: RM) => EM,
    thisArg?: any
  ): DoublyLinkedList<EM, RM> {
    const mappedList = new DoublyLinkedList<EM, RM>([], { toElementFn });
    let index = 0;
    for (const current of this) {
      mappedList.push(callback.call(thisArg, current, index, this));
      index++;
    }

    return mappedList;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(1)
   *
   * The function `countOccurrences` iterates through a doubly linked list and counts the occurrences
   * of a specified element or nodes that satisfy a given predicate.
   * @param {E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)} elementOrNode
   * - The `elementOrNode` parameter in the `countOccurrences` method can accept three types of values:
   * @returns The `countOccurrences` method returns the number of occurrences of the specified element,
   * node, or predicate function in the doubly linked list.
   */
  countOccurrences(elementOrNode: E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)): number {
    const predicate = this._ensurePredicate(elementOrNode);
    let count = 0;
    let current = this.head;

    while (current) {
      if (predicate(current)) {
        count++;
      }
      current = current.next;
    }

    return count;
  }

  /**
   * Time Complexity: O(n)
   * Space Complexity: O(n)
   *
   * The `fromArray` function creates a new instance of a DoublyLinkedList and populates it with the elements from the
   * given array.
   * @param {E[]} data - The `data` parameter is an array of elements of type `E`.
   * @returns The `fromArray` function returns a DoublyLinkedList object.
   */
  static fromArray<E>(data: E[]) {
    return new DoublyLinkedList<E>(data);
  }

  /**
   * The function returns an iterator that iterates over the values of a linked list.
   */
  protected *_getIterator(): IterableIterator<E> {
    let current = this.head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }

  /**
   * The function `_isPredicate` checks if the input is a function that takes a `DoublyLinkedListNode`
   * as an argument and returns a boolean.
   * @param {E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)} elementNodeOrPredicate
   * elementNodeOrPredicate - The `elementNodeOrPredicate` parameter can be one of the following
   * types:
   * @returns The _isPredicate method is returning a boolean value indicating whether the
   * elementNodeOrPredicate parameter is a function or not. If the elementNodeOrPredicate is a
   * function, the method will return true, indicating that it is a predicate function.
   */
  protected _isPredicate(
    elementNodeOrPredicate: E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)
  ): elementNodeOrPredicate is (node: DoublyLinkedListNode<E>) => boolean {
    return typeof elementNodeOrPredicate === 'function';
  }

  /**
   * The function `_ensureNode` ensures that the input is a valid node in a doubly linked list.
   * @param {E | DoublyLinkedListNode<E>} elementOrNode - The `elementOrNode` parameter can be either
   * an element of type `E` or a `DoublyLinkedListNode` containing an element of type `E`.
   * @returns If the `elementOrNode` parameter is already a `DoublyLinkedListNode`, it will be returned
   * as is. Otherwise, a new `DoublyLinkedListNode` instance will be created with the `elementOrNode`
   * value and returned.
   */
  protected _ensureNode(elementOrNode: E | DoublyLinkedListNode<E>) {
    if (this.isNode(elementOrNode)) return elementOrNode;

    return new DoublyLinkedListNode<E>(elementOrNode);
  }

  /**
   * The function `_ensurePredicate` in TypeScript ensures that the input is either a node, a predicate
   * function, or a value to compare with the node's value.
   * @param {E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)} elementNodeOrPredicate
   * elementNodeOrPredicate - The `elementNodeOrPredicate` parameter can be one of the following
   * types:
   * @returns A function is being returned that takes a `DoublyLinkedListNode` as a parameter and
   * returns a boolean value based on the conditions specified in the code.
   */
  protected _ensurePredicate(
    elementNodeOrPredicate: E | DoublyLinkedListNode<E> | ((node: DoublyLinkedListNode<E>) => boolean)
  ) {
    if (this.isNode(elementNodeOrPredicate)) return (node: DoublyLinkedListNode<E>) => node === elementNodeOrPredicate;

    if (this._isPredicate(elementNodeOrPredicate)) return elementNodeOrPredicate;

    return (node: DoublyLinkedListNode<E>) => node.value === elementNodeOrPredicate;
  }
}

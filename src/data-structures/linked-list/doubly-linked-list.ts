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
 * 1. Node Structure: Each node contains three parts: a data field, a pointer (or reference) to the previous node, and a pointer to the next node. This structure allows traversal of the linked list in both directions.
 * 2. Bidirectional Traversal: Unlike singly linked lists, doubly linked lists can be easily traversed forwards or backwards. This makes insertions and deletions in the list more flexible and efficient.
 * 3. No Centralized Index: Unlike arrays, elements in a linked list are not stored contiguously, so there is no centralized index. Accessing elements in a linked list typically requires traversing from the head or tail node.
 * 4. High Efficiency in Insertion and Deletion: Adding or removing elements in a linked list does not require moving other elements, making these operations more efficient than in arrays.
 * @example
 * // text editor operation history
 * const actions = [
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
 * const browserHistory = new DoublyLinkedList<string>();
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
 * // Define the Song interface
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
 * interface CacheEntry<K, V> {
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
 *     console.log(cache.get('a')).toBeUndefined();
 *     expect(cache.get('b')); // 2
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
 *     console.log(cache.get('b')).toBeUndefined();
 *     expect(cache.get('c')); // 3
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
 *     console.log(cache.get('a')).toBeUndefined();
 *     expect(cache.size); // 1
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
 * // Create a DoublyLinkedList to store song lyrics with timestamps
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
 *     const exactTimeLyric = lyricsList.findBackward(lyric => lyric.time <= 36000);
 *     console.log(exactTimeLyric?.text); // 'And ignite your bones'
 *
 *     // 2. Find lyric between timestamps
 *     const betweenTimeLyric = lyricsList.findBackward(lyric => lyric.time <= 22000);
 *     console.log(betweenTimeLyric?.text); // "When you lose something you can't replace"
 *
 *     // 3. Find first lyric when timestamp is less than first entry
 *     const earlyTimeLyric = lyricsList.findBackward(lyric => lyric.time <= -1000);
 *     console.log(earlyTimeLyric).toBeUndefined();
 *
 *     // 4. Find last lyric when timestamp is after last entry
 *     const lateTimeLyric = lyricsList.findBackward(lyric => lyric.time <= 50000);
 *     expect(lateTimeLyric?.text); // 'And I will try to fix you'
 * @example
 * // cpu process schedules
 * class Process {
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
  constructor(elements: Iterable<E> | Iterable<R> = [], options?: DoublyLinkedListOptions<E, R>) {
    super(options);
    this._head = undefined;
    this._tail = undefined;
    this._size = 0;
    if (elements) {
      for (const el of elements) {
        if (this.toElementFn) {
          this.push(this.toElementFn(el as R));
        } else this.push(el as E);
      }
    }
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
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   *
   * The push function adds a new element to the end of a doubly linked list.
   * @param {E} element - The "element" parameter represents the value that you want to add to the
   * doubly linked list.
   * @returns The `push` method is returning a boolean value, `true`.
   */
  push(element: E): boolean {
    const newNode = new DoublyLinkedListNode(element);
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
   * The unshift function adds a new element to the beginning of a doubly linked list.
   * @param {E} element - The "element" parameter represents the value of the element that you want to
   * add to the beginning of the doubly linked list.
   * @returns The `unshift` method is returning a boolean value, `true`.
   */
  unshift(element: E): boolean {
    const newNode = new DoublyLinkedListNode(element);
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
   * The function `findNodeByValue` searches for a node with a specific value in a doubly linked list and returns the
   * node if found, otherwise it returns undefined.
   * @param {E} value - The `value` parameter is the value that we want to search for in the doubly linked list.
   * @returns The function `findNodeByValue` returns a `DoublyLinkedListNode<E>` if a node with the specified value `value`
   * is found in the linked list. If no such node is found, it returns `undefined`.
   */
  getNode(value: E | undefined): DoublyLinkedListNode<E> | undefined {
    let current = this.head;

    while (current) {
      if (current.value === value) {
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
   * The `insert` function inserts a value at a specified index in a doubly linked list.
   * @param {number} index - The index parameter represents the position at which the new value should be inserted in the
   * DoublyLinkedList. It is of type number.
   * @param {E} value - The `value` parameter represents the value that you want to insert into the Doubly Linked List at the
   * specified index.
   * @returns The `insert` method returns a boolean value. It returns `true` if the insertion is successful, and `false`
   * if the index is out of bounds.
   */
  addAt(index: number, value: E): boolean {
    if (index < 0 || index > this._size) return false;
    if (index === 0) {
      this.unshift(value);
      return true;
    }
    if (index === this._size) {
      this.push(value);
      return true;
    }

    const newNode = new DoublyLinkedListNode(value);
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
   * The `addBefore` function inserts a new value before an existing value or node in a doubly linked list.
   * @param {E | DoublyLinkedListNode<E>} existingValueOrNode - The existing value or node in the doubly linked list
   * before which the new value will be inserted. It can be either the value of the existing node or the existing node
   * itself.
   * @param {E} newValue - The `newValue` parameter represents the value that you want to insert into the doubly linked
   * list.
   * @returns The method returns a boolean value. It returns `true` if the insertion is successful, and `false` if the
   * insertion fails.
   */
  addBefore(existingValueOrNode: E | DoublyLinkedListNode<E>, newValue: E): boolean {
    let existingNode;

    if (existingValueOrNode instanceof DoublyLinkedListNode) {
      existingNode = existingValueOrNode;
    } else {
      existingNode = this.getNode(existingValueOrNode);
    }

    if (existingNode) {
      const newNode = new DoublyLinkedListNode(newValue);
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
   * The `addAfter` function inserts a new node with a given value after an existing node in a doubly linked list.
   * @param {E | DoublyLinkedListNode<E>} existingValueOrNode - The existing value or node in the doubly linked list
   * after which the new value will be inserted. It can be either the value of the existing node or the existing node
   * itself.
   * @param {E} newValue - The value that you want to insert into the doubly linked list.
   * @returns The method returns a boolean value. It returns true if the insertion is successful, and false if the
   * existing value or node is not found in the doubly linked list.
   */
  addAfter(existingValueOrNode: E | DoublyLinkedListNode<E>, newValue: E): boolean {
    let existingNode;

    if (existingValueOrNode instanceof DoublyLinkedListNode) {
      existingNode = existingValueOrNode;
    } else {
      existingNode = this.getNode(existingValueOrNode);
    }

    if (existingNode) {
      const newNode = new DoublyLinkedListNode(newValue);
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
   * The `delete` function removes a node from a doubly linked list based on either the node itself or its value.
   * @param {E | DoublyLinkedListNode<E>} valOrNode - The `valOrNode` parameter can accept either a value of type `E` or
   * a `DoublyLinkedListNode<E>` object.
   * @returns The `delete` method returns a boolean value. It returns `true` if the value or node was successfully
   * deleted from the doubly linked list, and `false` if the value or node was not found in the list.
   */
  delete(valOrNode: E | DoublyLinkedListNode<E> | undefined): boolean {
    let node: DoublyLinkedListNode<E> | undefined;

    if (valOrNode instanceof DoublyLinkedListNode) {
      node = valOrNode;
    } else {
      node = this.getNode(valOrNode);
    }

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
   * The function returns the index of the first occurrence of a given value in a linked list.
   * @param {E} value - The parameter `value` is of type `E`, which means it can be any data type. It represents the value
   * that we are searching for in the linked list.
   * @returns The method `indexOf` returns the index of the first occurrence of the specified value `value` in the linked
   * list. If the value is not found, it returns -1.
   */
  indexOf(value: E): number {
    let index = 0;
    let current = this.head;
    while (current) {
      if (current.value === value) {
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
   * The `findBackward` function iterates through a linked list from the last node to the first node and returns the last
   * value that satisfies the given callback function, or undefined if no value satisfies the callback.
   * @param callback - A function that takes a value of type E as its parameter and returns a boolean value. This
   * function is used to determine whether a given value satisfies a certain condition.
   * @returns The method `findBackward` returns the last value in the linked list that satisfies the condition specified by
   * the callback function. If no value satisfies the condition, it returns `undefined`.
   */
  findBackward(callback: (value: E) => boolean): E | undefined {
    let current = this.tail;
    while (current) {
      if (callback(current.value)) {
        return current.value;
      }
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
   * The function returns an iterator that iterates over the values of a linked list.
   */
  protected *_getIterator(): IterableIterator<E> {
    let current = this.head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}

import { DoublyLinkedList, DoublyLinkedListNode } from '../../../../src';

describe('DoublyLinkedListNode', () => {
  it('should DoublyLinkedListNode', () => {
    const node1 = new DoublyLinkedListNode<number>(2);
    expect(node1.value).toBe(2);
    node1.value = 1;
    expect(node1.value).toBe(1);
  });
});

describe('DoublyLinkedList Operation Test', () => {
  let list: DoublyLinkedList<number>;

  beforeEach(() => {
    list = DoublyLinkedList.fromArray([1, 2, 3, 4, 5]);
  });

  it('should out of bound index', () => {
    expect(list.getNodeAt(-1)).toBe(undefined);
    expect(list.getNodeAt(5)).toBe(undefined);
    expect(list.addAt(5, 6)).toBe(true);
    expect(list.addAt(-1, 6)).toBe(false);
    expect(list.addAt(7, 6)).toBe(false);
    expect(list.addAt(100, 6)).toBe(false);
  });

  it('should addBefore', () => {
    expect(list.addBefore(1, 0)).toBe(true);
    expect(list.addBefore(list.getNode(1)!, 2)).toBe(true);
    expect([...list]).toEqual([0, 2, 1, 2, 3, 4, 5]);
  });

  it('should deleteAt', () => {
    expect(list.deleteAt(1)).toBe(2);
    expect(list.deleteAt(-1)).toBe(undefined);
    expect(list.deleteAt(list.length)).toBe(undefined);
    expect(list.length).toBe(4);
    expect(list.deleteAt(4)).toBe(undefined);
    expect([...list]).toEqual([1, 3, 4, 5]);
    expect(list.isEmpty()).toBe(false);
    expect(list.deleteAt(3)).toBe(5);
    expect([...list]).toEqual([1, 3, 4]);
  });

  it('should delete tail', () => {
    expect(list.delete(list.tail)).toBe(true);
    expect(list.tail?.value).toBe(4);
    expect(list.delete(6)).toBe(false);
    expect(list.tail?.value).toBe(4);
  });

  it('should clone', function () {
    const dList = new DoublyLinkedList<string>();
    dList.push('1');
    dList.push('6');
    dList.push('2');
    dList.push('0');
    dList.push('5');
    dList.push('9');
    dList.delete('2');
    expect([...dList]).toEqual(['1', '6', '0', '5', '9']);
    const cloned = dList.clone();
    expect([...cloned]).toEqual(['1', '6', '0', '5', '9']);
    dList.delete('5');
    expect([...dList]).toEqual(['1', '6', '0', '9']);
    expect([...cloned]).toEqual(['1', '6', '0', '5', '9']);
    expect(cloned.toVisual()).toEqual(['1', '6', '0', '5', '9']);
  });

  it('should find undefined', () => {
    expect(list.find(value => value === 6)).toBe(undefined);
    expect(list.find(value => value === 4)).toBe(4);
    expect(list.find(value => value === 3)).toBe(3);
  });

  it('should indexOf -1', () => {
    expect(list.indexOf(6)).toBe(-1);
  });

  it('should getBackward undefined', () => {
    expect(list.getBackward(node => node.value === 0)).toBe(undefined);
  });

  it('should addAfter tail', () => {
    expect(list.addAfter(list.tail!, 6)).toBe(true);
  });

  it('should addAfter tail', () => {
    expect([...list]).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('DoublyLinkedList Operation Test', () => {
  let list: DoublyLinkedList<number>;
  let objectList: DoublyLinkedList<{
    keyA: number;
  }>;

  beforeEach(() => {
    list = new DoublyLinkedList();
    objectList = new DoublyLinkedList();
  });

  it('should initialize an empty list', () => {
    expect(list.length).toBe(0);
    expect(list.head).toBe(undefined);
    expect(list.tail).toBe(undefined);
  });

  it('should initialize with toElementFn', () => {
    const dl = new DoublyLinkedList([{ key: 1 }, { key: 2 }, { key: 3 }], { toElementFn: ({ key }) => key });
    expect([...dl]).toEqual([1, 2, 3]);
    expect(dl.first).toBe(1);
    expect(dl.last).toBe(3);
  });

  it('should push elements to the list', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    expect(list.length).toBe(3);
    expect(list.head!.value).toBe(1);
    expect(list.tail!.value).toBe(3);
  });

  it('push with maxLen', () => {
    const list = new DoublyLinkedList<number>([], { maxLen: 10 });
    for (let i = 0; i < 1000; i++) {
      list.push(i);
    }
    expect(list.maxLen).toBe(10);
    expect(list.length).toBe(10);
    expect(list.first).toBe(990);

    list.clear();
    for (let i = 0; i < 1000; i++) {
      list.unshift(i);
    }

    expect(list.maxLen).toBe(10);
    expect(list.length).toBe(10);
    expect(list.last).toBe(990);
  });

  it('should pop elements from the end of the list', () => {
    list.push(1);
    list.push(2);
    const poppedValue = list.pop();
    expect(poppedValue).toBe(2);
    expect(list.length).toBe(1);
    expect(list.head!.value).toBe(1);
    expect(list.tail!.value).toBe(1);
    list.pop();
    expect([...list]).toEqual([]);
    list.pop();
    expect([...list]).toEqual([]);
  });
  it('should insert elements at specific positions', () => {
    expect(list.at(0)).toBe(undefined);
    list.push(1);
    list.push(2);
    list.push(3);

    // Inserting at the beginning
    list.addAt(0, 0);
    expect(list.length).toBe(4);
    expect(list.at(0)).toBe(0);
    expect(list.at(1)).toBe(1);

    // Inserting in the middle
    list.addAt(2, 1.5);
    expect(list.length).toBe(5);
    expect(list.at(2)).toBe(1.5);
    expect(list.at(3)).toBe(2);

    // Inserting at the end
    list.addAt(5, 4);
    expect(list.length).toBe(6);
    expect(list.at(5)).toBe(4);
    expect(list.tail!.value).toBe(4);
    expect(list.at(-1)).toBe(undefined);
    expect(list.at(6)).toBe(undefined);
  });

  it('should delete elements at specific positions', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    // Deleting from the beginning
    const deletedValue = list.deleteAt(0);
    expect(deletedValue).toBe(1);
    expect(list.length).toBe(2);
    expect(list.head!.value).toBe(2);

    // Deleting from the middle
    list.deleteAt(0); // Deleting the second element
    expect(list.length).toBe(1);
    expect(list.head!.value).toBe(3);

    // Deleting from the end
    list.deleteAt(0);
    expect(list.length).toBe(0);
    expect(list.head).toBe(undefined);
    expect(list.tail).toBe(undefined);
  });

  it('should delete elements by value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.delete(2);
    expect(list.length).toBe(2);
    expect(list.head!.value).toBe(1);
    expect(list.tail!.value).toBe(3);

    list.delete(1);
    expect(list.length).toBe(1);
    expect(list.head!.value).toBe(3);

    list.delete(3);
    expect(list.length).toBe(0);
    expect(list.head).toBe(undefined);
    expect(list.tail).toBe(undefined);
  });

  it('should reverse the linked list', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.reverse();

    expect(list.toArray()).toEqual([3, 2, 1]);
    expect(list.toReversedArray()).toEqual([1, 2, 3]);
  });

  it('should map elements using a callback function', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const mappedList = list.map(value => value * 2);

    expect(mappedList.toArray()).toEqual([2, 4, 6]);
  });

  it('should filter elements using a callback function', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);

    const filteredList = list.filter(value => value % 2 === 0);

    expect(filteredList.toArray()).toEqual([2, 4]);
  });

  it('should reduce elements using a callback function and an initial value', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);

    const sum = list.reduce((acc, value) => acc + value, 0);

    expect(sum).toBe(10);
  });

  it('should insert an element after a specific value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.addAfter(2, 2.5);

    expect(list.toArray()).toEqual([1, 2, 2.5, 3]);
  });

  it('should insert an element before a specific value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.addBefore(2, 1.5);

    expect(list.toArray()).toEqual([1, 1.5, 2, 3]);
  });
  it('should find the first element that satisfies a condition', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const found = list.find(value => value % 2 === 0);

    expect(found).toBe(2);
  });

  it('should find the index of an element', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const index = list.indexOf(2);

    expect(index).toBe(1);
  });

  it('should find the last element that satisfies a condition', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);

    const lastEven = list.getBackward(node => node.value % 2 === 0);

    expect(lastEven).toBe(4);
  });

  it('should clear the linked list', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.clear();

    expect(list.length).toBe(0);
    expect(list.head).toBe(undefined);
    expect(list.tail).toBe(undefined);
  });

  it('should create a reversed array of values', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const reversedArray = list.toReversedArray();

    expect(reversedArray).toEqual([3, 2, 1]);
  });

  it('should reverse the linked list', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    list.reverse();

    expect(list.toArray()).toEqual([3, 2, 1]);
    expect(list.head?.value).toBe(3);
    expect(list.tail?.value).toBe(1);
  });

  it('should iterate over each element and apply a callback', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const result: number[] = [];
    list.forEach(value => {
      result.push(value * 2);
    });

    expect(result).toEqual([2, 4, 6]);
  });

  it('should create a new linked list by applying a mapping function', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const mappedList = list.map(value => value * 2);

    expect(mappedList.toArray()).toEqual([2, 4, 6]);
  });

  it('should create a new linked list by filtering elements', () => {
    list.push(1);
    list.push(2);
    list.push(3);
    list.push(4);

    const filteredList = list.filter(value => value % 2 === 0);

    expect(filteredList.toArray()).toEqual([2, 4]);
  });

  it('should reduce the linked list to a single value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const sum = list.reduce((acc, value) => acc + value, 0);

    expect(sum).toBe(6);
  });

  it('should insert a new value after an existing value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const success = list.addAfter(2, 4);
    expect(success).toBe(true);
    expect(list.toArray()).toEqual([1, 2, 4, 3]);
  });

  it('should insert a new value before an existing value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const success = list.addBefore(2, 0);
    expect(success).toBe(true);
    expect(list.toArray()).toEqual([1, 0, 2, 3]);
  });

  it('should not insert a new value after a non-existing value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const success = list.addAfter(4, 5);
    expect(success).toBe(false);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it('should not insert a new value before a non-existing value', () => {
    list.push(1);
    list.push(2);
    list.push(3);

    const success = list.addBefore(4, 0);
    expect(success).toBe(false);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it('should insert and manipulate objects with numeric properties', () => {
    const obj1 = { keyA: 10 };
    const obj2 = { keyA: 20 };
    const obj3 = { keyA: 30 };

    objectList.push(obj1);
    objectList.push(obj2);
    objectList.push(obj3);

    expect(objectList.toArray()).toEqual([obj1, obj2, obj3]);

    const newObj = { keyA: 25 }; // Corrected newObj value
    const insertSuccess = objectList.addBefore(obj2, newObj);
    expect(insertSuccess).toBe(true);

    const getNode = objectList.getNode(newObj); // Use newObj instead of obj2
    expect(getNode?.value).toEqual(newObj);

    const deleted = objectList.delete(newObj); // Use newObj instead of obj2
    expect(deleted).toBe(true);

    const poppedObj = objectList.pop();
    expect(poppedObj).toBe(obj3);

    const shiftedObj = objectList.shift();
    expect(shiftedObj).toBe(obj1);
  });
});

describe('DoublyLinkedList Additional Methods', () => {
  // Slice method implementation and test
  test('slice should return a new list with specified range', () => {
    const list = new DoublyLinkedList([1, 2, 3, 4, 5]);
    const slicedList = list.slice(1, 4);

    expect(slicedList.toArray()).toEqual([2, 3, 4]);
    expect(list.length).toBe(5); // Original list unchanged
  });

  // Splice method implementation
  test('splice should modify list and return removed elements', () => {
    const list = new DoublyLinkedList([1, 2, 3, 4, 5]);
    const removedList = list.splice(2, 2, 6, 7);

    expect(list.toArray()).toEqual([1, 2, 6, 7, 5]);
    expect(removedList.toArray()).toEqual([3, 4]);
  });

  // Concat method test
  test('concat should combine multiple lists', () => {
    const list1 = new DoublyLinkedList([1, 2]);
    const list2 = new DoublyLinkedList([3, 4]);
    const list3 = new DoublyLinkedList([5, 6]);

    const concatenatedList = list1.concat(list2, list3);
    expect(concatenatedList.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  // Sort method test
  test('sort should order elements in ascending order', () => {
    const list = new DoublyLinkedList([5, 2, 8, 1, 9]);
    list.sort((a, b) => a - b);

    expect(list.toArray()).toEqual([1, 2, 5, 8, 9]);
  });

  // Reverse method test
  test('reverse should invert the list order', () => {
    const list = new DoublyLinkedList([1, 2, 3, 4, 5]);
    list.reverse();

    expect(list.toArray()).toEqual([5, 4, 3, 2, 1]);
  });

  // Join method test
  test('join should convert list to string with separator', () => {
    const list = new DoublyLinkedList(['a', 'b', 'c']);

    expect(list.join('-')).toBe('a-b-c');
    expect(list.join()).toBe('a,b,c');
  });

  // IndexOf method test
  test('indexOf should return first occurrence index', () => {
    const list = new DoublyLinkedList([1, 2, 3, 2, 1]);

    expect(list.indexOf(2)).toBe(1);
    expect(list.indexOf(4)).toBe(-1);
  });

  // LastIndexOf method test
  test('lastIndexOf should return last occurrence index', () => {
    const list = new DoublyLinkedList([1, 2, 3, 2, 1]);

    expect(list.lastIndexOf(2)).toBe(3);
    expect(list.lastIndexOf(4)).toBe(-1);
  });

  // findIndex method test
  test('findIndex should return first occurrence index', () => {
    const list = new DoublyLinkedList([1, 2, 3, 2, 1]);
    expect(list.findIndex(item => item === 2)).toBe(1);
    expect(list.findIndex(item => item === 4)).toBe(-1);
  });

  // fill method test
  test('fill should return fill all the list', () => {
    let list = new DoublyLinkedList([1, 2, 3, 2, 1]);
    expect([...list.fill(9)]).toEqual([9, 9, 9, 9, 9]);
    list = new DoublyLinkedList([1, 2, 3, 2, 1]);
    expect([...list.fill(9, 2, 3)]).toEqual([1, 2, 9, 2, 1]);
    list = new DoublyLinkedList([1, 2, 3, 2, 1]);
    expect([...list.fill(9, -3, -2)]).toEqual([1, 2, 9, 2, 1]);
    list = new DoublyLinkedList([1, 2, 3, 2, 1]);
    expect([...list.fill(9, -2, -3)]).toEqual([1, 2, 3, 2, 1]);
  });
});

describe('iterable methods', () => {
  it('should forEach, some, every, filter, map, reduce of the deque', () => {
    const dl = new DoublyLinkedList<number>();
    dl.push(1);
    dl.push(2);
    dl.push(3);

    const mockCallback = jest.fn();
    dl.forEach(element => {
      mockCallback(element);
    });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual([1]);
    expect(mockCallback.mock.calls[1]).toEqual([2]);
    expect(mockCallback.mock.calls[2]).toEqual([3]);

    expect(dl.every(element => element > 0)).toBe(true);
    expect(dl.every(element => element > 1)).toBe(false);
    expect(dl.some(element => element > 2)).toBe(true);

    expect([...dl.filter(element => element > 2)]).toEqual([3]);
    expect([...dl.map(element => element * 2)]).toEqual([2, 4, 6]);
    expect(dl.reduce((accumulator, element) => accumulator + element, 0)).toEqual(6);
  });

  it('values', () => {
    const dl = new DoublyLinkedList<number>();
    dl.shift();
    expect([...dl]).toEqual([]);
    dl.unshift(1);
    dl.push(2);
    dl.push(3);
    dl.delete(2);
    dl.unshift(0);
    dl.shift();
    dl.pop();
    dl.unshift(3);
    expect([...dl.values()]).toEqual([3, 1]);
  });

  it('some', () => {
    const dl = new DoublyLinkedList<number>();
    dl.push(1);
    dl.push(2);
    dl.push(3);
    dl.delete(2);
    dl.unshift(0);
    dl.shift();
    dl.pop();
    dl.unshift(3);
    expect(dl.some(value => value > 1)).toBe(true);
    expect(dl.some(value => value > 100)).toBe(false);
  });
});

describe('classic use', () => {
  it('@example text editor operation history', () => {
    const actions = [
      { type: 'insert', content: 'first line of text' },
      { type: 'insert', content: 'second line of text' },
      { type: 'delete', content: 'delete the first line' }
    ];
    const editorHistory = new DoublyLinkedList<{ type: string; content: string }>(actions);

    expect(editorHistory.last?.type).toBe('delete');
    expect(editorHistory.pop()?.content).toBe('delete the first line');
    expect(editorHistory.last?.type).toBe('insert');
  });

  it('@example Browser history', () => {
    const browserHistory = new DoublyLinkedList<string>();

    browserHistory.push('home page');
    browserHistory.push('search page');
    browserHistory.push('details page');

    expect(browserHistory.last).toBe('details page');
    expect(browserHistory.pop()).toBe('details page');
    expect(browserHistory.last).toBe('search page');
  });

  it('@example Use DoublyLinkedList to implement music player', () => {
    // Define the Song interface
    interface Song {
      title: string;
      artist: string;
      duration: number; // duration in seconds
    }

    class Player {
      private playlist: DoublyLinkedList<Song>;
      private currentSong: ReturnType<typeof this.playlist.getNodeAt> | undefined;

      constructor(songs: Song[]) {
        this.playlist = new DoublyLinkedList<Song>();
        songs.forEach(song => this.playlist.push(song));
        this.currentSong = this.playlist.head;
      }

      // Play the next song in the playlist
      playNext(): Song | undefined {
        if (!this.currentSong?.next) {
          this.currentSong = this.playlist.head; // Loop to the first song
        } else {
          this.currentSong = this.currentSong.next;
        }
        return this.currentSong?.value;
      }

      // Play the previous song in the playlist
      playPrevious(): Song | undefined {
        if (!this.currentSong?.prev) {
          this.currentSong = this.playlist.tail; // Loop to the last song
        } else {
          this.currentSong = this.currentSong.prev;
        }
        return this.currentSong?.value;
      }

      // Get the current song
      getCurrentSong(): Song | undefined {
        return this.currentSong?.value;
      }

      // Loop through the playlist twice
      loopThroughPlaylist(): Song[] {
        const playedSongs: Song[] = [];
        const initialNode = this.currentSong;

        // Loop through the playlist twice
        for (let i = 0; i < this.playlist.length * 2; i++) {
          playedSongs.push(this.currentSong!.value);
          this.currentSong = this.currentSong!.next || this.playlist.head; // Loop back to the start if needed
        }

        // Reset the current song to the initial song
        this.currentSong = initialNode;
        return playedSongs;
      }
    }

    const songs = [
      { title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 },
      { title: 'Hotel California', artist: 'Eagles', duration: 391 },
      { title: 'Shape of You', artist: 'Ed Sheeran', duration: 233 },
      { title: 'Billie Jean', artist: 'Michael Jackson', duration: 294 }
    ];
    let player = new Player(songs);
    // should play the next song
    player = new Player(songs);
    const firstSong = player.getCurrentSong();
    const nextSong = player.playNext();

    // Expect the next song to be "Hotel California by Eagles"
    expect(nextSong).toEqual({ title: 'Hotel California', artist: 'Eagles', duration: 391 });
    expect(firstSong).toEqual({ title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 });

    // should play the previous song
    player = new Player(songs);
    player.playNext(); // Move to the second song
    const currentSong = player.getCurrentSong();
    const previousSong = player.playPrevious();

    // Expect the previous song to be "Bohemian Rhapsody by Queen"
    expect(previousSong).toEqual({ title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 });
    expect(currentSong).toEqual({ title: 'Hotel California', artist: 'Eagles', duration: 391 });

    // should loop to the first song when playing next from the last song
    player = new Player(songs);
    player.playNext(); // Move to the second song
    player.playNext(); // Move to the third song
    player.playNext(); // Move to the fourth song

    const nextSongToFirst = player.playNext(); // Should loop to the first song

    // Expect the next song to be "Bohemian Rhapsody by Queen"
    expect(nextSongToFirst).toEqual({ title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 });

    // should loop to the last song when playing previous from the first song
    player = new Player(songs);
    player.playNext(); // Move to the first song
    player.playNext(); // Move to the second song
    player.playNext(); // Move to the third song
    player.playNext(); // Move to the fourth song

    const previousToLast = player.playPrevious(); // Should loop to the last song

    // Expect the previous song to be "Billie Jean by Michael Jackson"
    expect(previousToLast).toEqual({ title: 'Billie Jean', artist: 'Michael Jackson', duration: 294 });

    // should loop through the entire playlist
    player = new Player(songs);
    const playedSongs = player.loopThroughPlaylist();

    // The expected order of songs for two loops
    expect(playedSongs).toEqual([
      { title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 },
      { title: 'Hotel California', artist: 'Eagles', duration: 391 },
      { title: 'Shape of You', artist: 'Ed Sheeran', duration: 233 },
      { title: 'Billie Jean', artist: 'Michael Jackson', duration: 294 },
      { title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 },
      { title: 'Hotel California', artist: 'Eagles', duration: 391 },
      { title: 'Shape of You', artist: 'Ed Sheeran', duration: 233 },
      { title: 'Billie Jean', artist: 'Michael Jackson', duration: 294 }
    ]);
  });

  it('@example Use DoublyLinkedList to implement LRU cache', () => {
    interface CacheEntry<K, V> {
      key: K;
      value: V;
    }

    class LRUCache<K = string, V = any> {
      private readonly capacity: number;
      private list: DoublyLinkedList<CacheEntry<K, V>>;
      private map: Map<K, DoublyLinkedListNode<CacheEntry<K, V>>>;

      constructor(capacity: number) {
        if (capacity <= 0) {
          throw new Error('lru cache capacity must be greater than 0');
        }
        this.capacity = capacity;
        this.list = new DoublyLinkedList<CacheEntry<K, V>>();
        this.map = new Map<K, DoublyLinkedListNode<CacheEntry<K, V>>>();
      }

      // Get the current cache length
      get length(): number {
        return this.list.length;
      }

      // Check if it is empty
      get isEmpty(): boolean {
        return this.list.isEmpty();
      }

      // Get cached value
      get(key: K): V | undefined {
        const node = this.map.get(key);

        if (!node) return undefined;

        // Move the visited node to the head of the linked list (most recently used)
        this.moveToFront(node);

        return node.value.value;
      }

      // Set cache value
      set(key: K, value: V): void {
        // Check if it already exists
        const node = this.map.get(key);

        if (node) {
          // Update value and move to head
          node.value.value = value;
          this.moveToFront(node);
          return;
        }

        // Check capacity
        if (this.list.length >= this.capacity) {
          // Delete the least recently used element (the tail of the linked list)
          const removedNode = this.list.tail;
          if (removedNode) {
            this.map.delete(removedNode.value.key);
            this.list.pop();
          }
        }

        // Create new node and add to head
        const newEntry: CacheEntry<K, V> = { key, value };
        this.list.unshift(newEntry);

        // Save node reference in map
        const newNode = this.list.head;
        if (newNode) {
          this.map.set(key, newNode);
        }
      }

      // Delete specific key
      delete(key: K): boolean {
        const node = this.map.get(key);
        if (!node) return false;

        // Remove from linked list
        this.list.delete(node);
        // Remove from map
        this.map.delete(key);

        return true;
      }

      // Clear cache
      clear(): void {
        this.list.clear();
        this.map.clear();
      }

      // Move the node to the head of the linked list
      private moveToFront(node: DoublyLinkedListNode<CacheEntry<K, V>>): void {
        this.list.delete(node);
        this.list.unshift(node.value);
      }
    }

    // should set and get values correctly
    const cache = new LRUCache<string, number>(3);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);

    // The least recently used element should be evicted when capacity is exceeded
    cache.clear();
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('d', 4); // This will eliminate 'a'

    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
    expect(cache.get('d')).toBe(4);

    // The priority of an element should be updated when it is accessed
    cache.clear();
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    cache.get('a'); // access 'a'
    cache.set('d', 4); // This will eliminate 'b'

    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('c')).toBe(3);
    expect(cache.get('d')).toBe(4);

    // Should support updating existing keys
    cache.clear();
    cache.set('a', 1);
    cache.set('a', 10);

    expect(cache.get('a')).toBe(10);

    // Should support deleting specified keys
    cache.clear();
    cache.set('a', 1);
    cache.set('b', 2);

    expect(cache.delete('a')).toBe(true);
    expect(cache.get('a')).toBeUndefined();
    expect(cache.length).toBe(1);

    // Should support clearing cache
    cache.clear();
    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();

    expect(cache.length).toBe(0);
    expect(cache.isEmpty).toBe(true);
  });

  it('@example finding lyrics by timestamp in Coldplay\'s "Fix You"', () => {
    // Create a DoublyLinkedList to store song lyrics with timestamps
    const lyricsList = new DoublyLinkedList<{ time: number; text: string }>();

    // Detailed lyrics with precise timestamps (in milliseconds)
    const lyrics = [
      { time: 0, text: "When you try your best, but you don't succeed" },
      { time: 4000, text: 'When you get what you want, but not what you need' },
      { time: 8000, text: "When you feel so tired, but you can't sleep" },
      { time: 12000, text: 'Stuck in reverse' },
      { time: 16000, text: 'And the tears come streaming down your face' },
      { time: 20000, text: "When you lose something you can't replace" },
      { time: 24000, text: 'When you love someone, but it goes to waste' },
      { time: 28000, text: 'Could it be worse?' },
      { time: 32000, text: 'Lights will guide you home' },
      { time: 36000, text: 'And ignite your bones' },
      { time: 40000, text: 'And I will try to fix you' }
    ];

    // Populate the DoublyLinkedList with lyrics
    lyrics.forEach(lyric => lyricsList.push(lyric));

    // Test different scenarios of lyric synchronization

    // 1. Find lyric at exact timestamp
    const exactTimeLyric = lyricsList.getBackward(lyric => lyric.value.time <= 36000);
    expect(exactTimeLyric?.text).toBe('And ignite your bones');

    // 2. Find lyric between timestamps
    const betweenTimeLyric = lyricsList.getBackward(lyric => lyric.value.time <= 22000);
    expect(betweenTimeLyric?.text).toBe("When you lose something you can't replace");

    // 3. Find first lyric when timestamp is less than first entry
    const earlyTimeLyric = lyricsList.getBackward(lyric => lyric.value.time <= -1000);
    expect(earlyTimeLyric).toBeUndefined();

    // 4. Find last lyric when timestamp is after last entry
    const lateTimeLyric = lyricsList.getBackward(lyric => lyric.value.time <= 50000);
    expect(lateTimeLyric?.text).toBe('And I will try to fix you');
  });

  it('@example cpu process schedules', () => {
    class Process {
      constructor(
        public id: number,
        public priority: number
      ) {}

      execute(): string {
        return `Process ${this.id} executed.`;
      }
    }

    class Scheduler {
      private queue: DoublyLinkedList<Process>;

      constructor() {
        this.queue = new DoublyLinkedList<Process>();
      }

      addProcess(process: Process): void {
        // Insert processes into a queue based on priority, keeping priority in descending order
        let current = this.queue.head;
        while (current && current.value.priority >= process.priority) {
          current = current.next;
        }

        if (!current) {
          this.queue.push(process);
        } else {
          this.queue.addBefore(current, process);
        }
      }

      executeNext(): string | undefined {
        // Execute tasks at the head of the queue in order
        const process = this.queue.shift();
        return process ? process.execute() : undefined;
      }

      listProcesses(): string[] {
        return this.queue.toArray().map(process => `Process ${process.id} (Priority: ${process.priority})`);
      }

      clear(): void {
        this.queue.clear();
      }
    }

    // should add processes based on priority
    let scheduler = new Scheduler();
    scheduler.addProcess(new Process(1, 10));
    scheduler.addProcess(new Process(2, 20));
    scheduler.addProcess(new Process(3, 15));

    expect(scheduler.listProcesses()).toEqual([
      'Process 2 (Priority: 20)',
      'Process 3 (Priority: 15)',
      'Process 1 (Priority: 10)'
    ]);

    // should execute the highest priority process
    scheduler = new Scheduler();
    scheduler.addProcess(new Process(1, 10));
    scheduler.addProcess(new Process(2, 20));

    expect(scheduler.executeNext()).toBe('Process 2 executed.');
    expect(scheduler.listProcesses()).toEqual(['Process 1 (Priority: 10)']);

    // should clear all processes
    scheduler = new Scheduler();
    scheduler.addProcess(new Process(1, 10));
    scheduler.addProcess(new Process(2, 20));

    scheduler.clear();
    expect(scheduler.listProcesses()).toEqual([]);
  });
});

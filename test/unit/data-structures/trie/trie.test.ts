import { Trie, TrieNode } from '../../../../src';

describe('TrieNode', () => {
  it('should create a TrieNode with the given value', () => {
    const node = new TrieNode('a');
    expect(node.key).toBe('a');
    expect(node.isEnd).toBe(false);
    expect(node.children.size).toBe(0);
  });

  it('should add a child to TrieNode', () => {
    const parentNode = new TrieNode('a');
    const childNode = new TrieNode('b');
    parentNode.children.set('b', childNode);

    expect(parentNode.children.size).toBe(1);
    expect(parentNode.children.get('b')).toBe(childNode);
  });

  it('should set isEnd property correctly', () => {
    const node = new TrieNode('a');
    node.isEnd = true;
    expect(node.isEnd).toBe(true);
  });

  it('should set key property correctly', () => {
    const node = new TrieNode('a');
    node.isEnd = false;
    expect(node).toEqual({
      _children: new Map(),
      _isEnd: false,
      _key: 'a'
    });
    node.key = 'b';
    expect(node.key).toBe('b');
    expect(node).toEqual({
      _children: new Map(),
      _isEnd: false,
      _key: 'b'
    });
  });

  it('should set children property correctly', () => {
    const node = new TrieNode('a');
    node.isEnd = false;
    const children = new Map<string, TrieNode>([['p', new TrieNode('p')]]);
    node.children = children;
    expect(node.children).toEqual(children);
  });
});

describe('Trie', () => {
  it('should create an empty Trie', () => {
    const trie = new Trie();
    expect(trie.root.key).toBe('');
    expect(trie.root.children.size).toBe(0);
  });

  it('should add words to Trie', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    expect(trie.has('apple')).toBe(true);
    expect(trie.has('app')).toBe(true);
    expect(trie.has('banana')).toBe(false);
  });

  it('should check if a string is an absolute prefix', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    expect(trie.hasPurePrefix('appl')).toBe(true);
    expect(trie.hasPurePrefix('apples')).toBe(false);
  });

  it('should check if a string is a prefix', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    expect(trie.hasPrefix('app')).toBe(true);
    expect(trie.hasPrefix('banana')).toBe(false);
  });

  it('should clone', function () {
    const trie = new Trie();
    trie.add('1');
    trie.add('6');
    trie.add('2');
    trie.add('0');
    trie.add('5');
    trie.add('9');
    trie.delete('2');
    expect([...trie]).toEqual(['1', '6', '0', '5', '9']);
    const cloned = trie.clone();
    expect([...cloned]).toEqual(['1', '6', '0', '5', '9']);
    trie.delete('5');
    expect([...trie]).toEqual(['1', '6', '0', '9']);
    expect([...cloned]).toEqual(['1', '6', '0', '5', '9']);
  });

  it('should check if a string is a common prefix', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    expect(trie.hasCommonPrefix('ap')).toBe(true);
    expect(trie.hasCommonPrefix('app')).toBe(true);
    expect(trie.hasCommonPrefix('b')).toBe(false);
  });

  it('should get the longest common prefix', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    expect(trie.getLongestCommonPrefix()).toBe('app');
  });

  it('should get all words with a given prefix', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    trie.add('application');
    const words = trie.getWords('app');
    expect(words).toEqual(['apple', 'application', 'app']);
  });

  it('should delete words from Trie', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    expect(trie.has('apple')).toBe(true);
    trie.delete('apple');
    expect(trie.has('apple')).toBe(false);
    expect(trie.has('app')).toBe(true);
    trie.delete('app');
    expect(trie.has('app')).toBe(false);
  });

  it('should suggestion Trie work well', () => {
    const trie = new Trie();
    const products = ['carpet', 'cart', 'car', 'camera'];
    products.forEach(product => trie.add(product));
    expect(trie.getWords('car', 2)).toEqual(['carpet', 'cart']);
    const prods = [
      'Phone',
      'TV',
      'Laptop',
      'Washing Machine',
      'Refrigerator',
      'Air Conditioner',
      'Mouse',
      'Keyboard',
      'Headphones',
      'Watch',
      'Fan',
      'Chair',
      'Table',
      'Bookshelf',
      'Lamp',
      'Camera',
      'Gaming Console',
      'Projector',
      'Printer',
      'Robot Vacuum',
      'Microwave',
      'Toaster',
      'Coffee Maker',
      'Blender',
      'Vacuum Cleaner',
      'Drill',
      'Router',
      'Monitor',
      'Tablet',
      'Speakers',
      'Smartwatch',
      'Hair Dryer',
      'Iron',
      'Microwave Oven',
      'Oven',
      'Blu-ray Player',
      'Carpet Cleaner',
      'Recliner',
      'Desk',
      'Pen',
      'Pencil',
      'Notepad',
      'Backpack',
      'Sunglasses',
      'Umbrella',
      'Jacket',
      'Shoes',
      'Bracelet',
      'Socks',
      'Hat',
      'Scarf',
      'Gloves',
      'Bicycle',
      'Scooter',
      'Skateboard',
      'Surfboard',
      'Soccer Ball',
      'Basketball',
      'Tennis Racket',
      'Golf Clubs',
      'Baseball Bat',
      'Fishing Rod',
      'Hiking Boots',
      'Tent',
      'Sleeping Bag',
      'Camp Stove',
      'Duffle Bag',
      'Guitar',
      'Piano',
      'Violin',
      'Drums',
      'Trumpet',
      'Harmonica',
      'Flute',
      'Microphone',
      'Amplifier',
      'Speaker System',
      'Couch',
      'Coffee Table',
      'Dining Table',
      'Sideboard',
      'Bed',
      'Mattress',
      'Pillow',
      'Blanket',
      'Rug',
      'Dresser',
      'Wardrobe',
      'Dining Chair',
      'Cabinet',
      'Shower Curtain',
      'Toothbrush',
      'Toothpaste',
      'Shampoo',
      'Soap',
      'Razor',
      'Towel',
      'Toilet Paper',
      'Laundry Detergent',
      'Dish Soap',
      'Broom',
      'Mop',
      'Trash Can',
      'Ironing Board',
      'Food Processor',
      'Slow Cooker',
      'Stand Mixer',
      'Cutting Board',
      'Knife Set',
      'Dining Set',
      'Silverware Set',
      'Bakeware Set',
      'Cookware Set',
      'Frying Pan',
      'Baking Sheet',
      'Mixing Bowls',
      'Can Opener',
      'Peeler',
      'Measuring Cups',
      'Utensil Set',
      'Dish Rack',
      'Storage Containers',
      'Trash Bags',
      'Aluminum Foil',
      'Plastic Wrap',
      'Ziplock Bags',
      'Cleaning Supplies',
      'Bath Towels',
      'Hand Towels',
      'Face Towels',
      'Bath Mat',
      'Shower Caddy',
      'Soap Dispenser',
      'Toothbrush Holder',
      'Shower Head',
      'Toilet Brush',
      'Plunger',
      'Hair Straightener',
      'Curling Iron',
      'Makeup Mirror',
      'Shaving Kit',
      'Cosmetic Bag',
      'Perfume',
      'Cologne',
      'Shower Gel',
      'Lotion',
      'Deodorant',
      'Sunscreen',
      'Toilet Paper Holder',
      'Laundry Basket',
      'Step Stool',
      'Flashlight',
      'Batteries',
      'Power Strip',
      'Extension Cord',
      'Toolbox',
      'Screwdriver Set',
      'Wrench',
      'Pliers',
      'Hammer',
      'Tape Measure',
      'Level',
      'Utility Knife',
      'Cordless Drill',
      'Safety Glasses',
      'Tool Belt',
      'Ladder',
      'Paint Brushes',
      'Paint Rollers',
      'Drop Cloth',
      "Painter's Tape",
      'Paint Cans',
      'Wallpaper',
      'Wallpaper Paste',
      'Wallpaper Brush',
      'Wallpaper Roller',
      'Curtains',
      'Curtain Rod',
      'Curtain Rings',
      'Blinds',
      'Rugs',
      'Wall Clock',
      'Alarm Clock',
      'Desk Lamp',
      'Ceiling Fan',
      'Chandelier',
      'Floor Lamp',
      'Bedside Lamp',
      'Lawn Mower',
      'Hedge Trimmer',
      'Leaf Blower',
      'Garden Hose',
      'Sprinkler',
      'Gardening Tools',
      'Grill',
      'BBQ Tools',
      'Cooler',
      'Picnic Basket',
      'Camping Gear',
      'Pocket Knife',
      'Fishing Gear',
      'Boat',
      'Life Jacket',
      'Swimwear',
      'Beach Towel',
      'Beach Umbrella',
      'Wetsuit',
      'Snowboard',
      'Ski Equipment',
      'Snow Boots',
      'Snow Gloves',
      'Snow Goggles',
      'Snowshoes',
      'Sled',
      'Ice Skates',
      'Frisbee',
      'Pool Table',
      'Ping Pong Table',
      'Dartboard',
      'Chess Set',
      'Board Games',
      'Playing Cards',
      'Puzzle',
      'Video Games',
      'Gaming Chair',
      'VR Headset',
      'Binoculars',
      'Telescope',
      'Drone',
      'Action Camera',
      'Smartphone',
      'Desktop Computer',
      'Scanner',
      'External Hard Drive',
      'USB Flash Drive',
      'Computer Keyboard',
      'Computer Mouse',
      'Webcam',
      'Modem',
      'Ethernet Cable',
      'Wireless Headphones',
      'Bluetooth Speaker',
      'Earbuds',
      'Fitness Tracker',
      'Running Shoes',
      'Cycling Helmet',
      'Yoga Mat',
      'Dumbbells',
      'Resistance Bands',
      'Exercise Ball',
      'Jump Rope',
      'Treadmill',
      'Exercise Bike',
      'Elliptical Machine',
      'Weight Bench',
      'Gym Bag',
      'Tennis Shoes',
      'Swimsuit',
      'Goggles',
      'Snorkel',
      'Life Vest',
      'Bicycle Helmet',
      'Roller Skates',
      'Inline Skates',
      'Luggage Set',
      'Travel Pillow',
      'Suitcase',
      'Carry-On Bag',
      'Checked Bag',
      'Tote Bag',
      'Travel Adapter',
      'Neck Pillow',
      'Sleep Mask',
      'Portable Charger',
      'Camera Bag',
      'Laptop Bag',
      'Briefcase',
      'Hiking Backpack',
      'Hydration Pack',
      'Duffel Bag',
      'Messenger Bag',
      'Shoulder Bag',
      'Clutch',
      'Wallet',
      'Crossbody Bag',
      'Satchel',
      'Bucket Bag',
      'Hobo Bag',
      'Tennis Bag',
      'Golf Bag',
      'Weekender Bag',
      'Beach Bag',
      'Ski Bag',
      'Snowboard Bag',
      'Snowshoe Bag',
      'Surfboard Bag',
      'Wakeboard Bag',
      'Kiteboard Bag',
      'Skateboard Bag',
      'Roller Skates Bag',
      'Scuba Gear Bag',
      'Fishing Rod Bag',
      'Guitar Case',
      'Violin Case',
      'Trumpet Case',
      'Flute Case',
      'Clarinet Case',
      'Saxophone Case',
      'Keyboard Case',
      'Drum Case',
      'Speaker Case',
      'Microphone Case',
      'Camera Case',
      'Tripod Bag',
      'Binocular Case',
      'Telescope Case',
      'Art Supplies',
      'Paints',
      'Brushes',
      'Canvas',
      'Easel',
      'Sketchbook',
      'Pencils',
      'Watercolors',
      'Oil Paints',
      'Acrylic Paints',
      'Charcoal',
      'Pastels',
      'Markers',
      'Colored Pencils',
      'Crayons',
      'Chalk',
      'Ink',
      'Pottery Wheel',
      'Clay',
      'Pottery Tools',
      'Knitting Needles',
      'Yarn',
      'Crochet Hooks',
      'Sewing Machine',
      'Fabric',
      'Thread',
      'Sewing Needles',
      'Embroidery Hoop',
      'Cross-Stitch Kit',
      'Quilting Kit',
      'Model Kit',
      'Remote Control Car',
      'Train Set',
      'LEGO Set',
      'Building Blocks',
      'Dollhouse',
      'Action Figures',
      'Video Game Console',
      'Controller',
      'Virtual Reality Headset',
      'Poker Set',
      'Checkers Set',
      'Backgammon Set',
      'Dominoes Set',
      'Jigsaw Puzzle',
      'Racing Game',
      'Adventure Game',
      'Role-Playing Game',
      'First-Person Shooter',
      'Simulation Game',
      'Strategy Game',
      'Sports Game',
      'RPG Game',
      'Action-Adventure Game',
      'Fighting Game',
      'Platform Game',
      'Music Game',
      'Educational Game',
      'Puzzle Game',
      'Arcade Game',
      'Card Game',
      'Board Game',
      'Outdoor Game',
      'Indoor Game',
      'Word Game',
      'Brain Teaser',
      'Logic Puzzle',
      'Trivia Game',
      'Classic Game',
      'Party Game',
      'Family Game',
      "Children's Game",
      'Adult Game',
      'Dice Game',
      'Tile Game',
      'Electronic Game',
      'Video Game',
      'Retro Game',
      'Computer Game',
      'Console Game',
      'Mobile Game',
      'PC Game',
      'VR Game',
      'Deck-Building Game',
      'Cooperative Game',
      'Competitive Game',
      'Social Deduction Game',
      'Trading Card Game',
      'Collectible Card Game',
      'Miniatures Game',
      'Tabletop Game',
      'War Game',
      'Fantasy Game',
      'Science Fiction Game',
      'Horror Game',
      'Mystery Game',
      'Abstract Game',
      'Eurogame',
      'Ameritrash Game',
      'Wargame',
      '2-Player Game',
      'Drinking Game',
      'Action Figure',
      'Playset',
      'Educational Toy',
      'Stuffed Animal',
      'Doll',
      'Remote Control Toy',
      'Toy Car',
      'Toy Train',
      'Pretend Play Toy',
      'Construction Toy',
      'Art and Craft Kit',
      'Musical Toy',
      'Science Toy',
      'STEM Toy',
      'Puzzle Toy',
      'Building Toy',
      'Magnetic Toy',
      'Robot Toy',
      'Outdoor Toy',
      'Sports Toy',
      'Board Game Expansion',
      'Shooter Game',
      'Learning Toy',
      'Teaching Aid',
      'Flashcards',
      'Alphabet Blocks',
      'Educational Books',
      'Math Toy',
      'Science Kit',
      'Geography Toy',
      'History Toy',
      'Language Learning Toy',
      'Music Toy',
      'Art Toy',
      'STEM Kit',
      'Coding Toy',
      'Robotics Kit',
      'Building Kit',
      'Logic Toy',
      'Spelling Game',
      'Memory Game',
      'Problem-Solving Toy',
      'Critical Thinking Toy',
      'Math Game',
      'Science Game',
      'Geography Game',
      'History Game',
      'Language Learning Game',
      'Art Game',
      'Coding Game',
      'Robotics Game',
      'Building Game',
      'Memory Card',
      'Flash Drive',
      'Internal Hard Drive',
      'Solid State Drive',
      'Optical Drive',
      'USB Hub',
      'Computer Monitor',
      'Mouse Pad',
      'Laptop Stand',
      'Ink Cartridges',
      'Printer Paper',
      'Wireless Router',
      'Wi-Fi Extender',
      'Network Switch',
      'Headset',
      'External Sound Card',
      'Surge Protector',
      'Uninterruptible Power Supply',
      'Cable Management',
      'Office Chair',
      'File Cabinet',
      'Shelves',
      'Filing Supplies',
      'Stapler',
      'Staples',
      'Paper Clips',
      'Binder Clips',
      'Rubber Bands',
      'Envelopes',
      'Mailing Labels',
      'Address Labels',
      'Tape Dispenser',
      'Scissors',
      'Tape',
      'Glue',
      'Whiteboard',
      'Dry Erase Markers',
      'Corkboard',
      'Bulletin Board',
      'Push Pins',
      'Thumbtacks',
      'Desktop Organizer',
      'Calendar',
      'Planner',
      'Notebooks',
      'Legal Pads',
      'Notepads',
      'Ballpoint Pens',
      'Rollerball Pens',
      'Gel Pens',
      'Fountain Pens',
      'Highlighters',
      'Erasers',
      'Pencil Sharpeners',
      'Watercolor Paints',
      'Paintbrushes',
      'Easels',
      'Sketchbooks',
      'Drawing Paper',
      'Scrapbooking Supplies',
      'Craft Paper',
      'Craft Tools',
      'Origami Paper',
      'Calligraphy Supplies',
      'Printmaking Supplies',
      'Molding Clay',
      'Glazes',
      'Kiln',
      'Palette',
      'Canvas Boards',
      'Canvas Rolls',
      'Canvas Panels',
      'Stretched Canvas',
      'Oil Pastels',
      'Watercolor Pencils',
      'Pastel Paper',
      'Fixative Spray',
      'Eraser',
      'Pencil Sharpener',
      'Drawing Pens',
      'Calligraphy Set',
      'Ink Pens',
      'Sketching Charcoal',
      'Blending Stumps',
      'Watercolor Paper',
      'Watercolor Brushes',
      'Watercolor Palette',
      'Watercolor Mediums',
      'Watercolor Ground',
      'Watercolor Markers',
      'Acrylic Brushes',
      'Acrylic Mediums',
      'Palette Knives',
      'Gesso',
      'Acrylic Paper',
      'Airbrush Supplies',
      'Oil Brushes',
      'Oil Mediums',
      'Linseed Oil',
      'Turpentine',
      'Odorless Mineral Spirits',
      'Paper',
      'Drawing Ink',
      'Modeling Tools',
      'Pottery Brushes',
      'Throwing Bats',
      'Apron',
      'Wheel Throwing Kit',
      'Kiln Accessories',
      'Pottery Stamps',
      'Pottery Books',
      'Sculpting Tools',
      'Carving Tools',
      'Wood Carving Tools',
      'Stone Carving Tools',
      'Clay Sculpting Tools',
      'Pottery Tool Set',
      'Pottery Tool Kit',
      'Clay Extruder',
      'Pottery Rib Tools',
      'Sponge',
      'Kiln Furniture',
      'Pyrometer',
      'Kiln Shelves',
      'Kiln Posts',
      'Kiln Stilts',
      'Pottery Wire',
      'Ceramic Tiles',
      'Ceramic Glaze',
      'Raku Glaze',
      'Porcelain Glaze',
      'High-Fire Glaze',
      'Low-Fire Glaze',
      'Cone 6 Glaze',
      'Cone 10 Glaze',
      'Underglaze',
      'Slip',
      'Pottery Clay',
      'Clay Sculpture',
      'Pottery Figurines',
      'Pottery Mugs',
      'Pottery Bowls',
      'Pottery Plates',
      'Pottery Vases',
      'Pottery Teapots',
      'Pottery Platters',
      'Pottery Pitchers',
      'Pottery Planters',
      'Pottery Sculptures',
      'Pottery Wall Art',
      'Pottery Tiles',
      'Pottery Dinnerware',
      'Pottery Serveware',
      'Pottery Bakeware',
      'Pottery Home Decor',
      'Pottery Jewelry',
      'Pottery Kiln',
      'Ceramic Sculpture',
      'Ceramic Figurines',
      'Ceramic Mugs',
      'Ceramic Bowls',
      'Ceramic Plates',
      'Ceramic Vases',
      'Ceramic Teapots',
      'Ceramic Platters',
      'Ceramic Pitchers',
      'Ceramic Planters',
      'Ceramic Sculptures',
      'Ceramic Wall Art',
      'Ceramic Dinnerware',
      'Ceramic Serveware',
      'Ceramic Bakeware',
      'Ceramic Home Decor',
      'Ceramic Jewelry',
      'Ceramic Kiln',
      'Ceramic Wheel',
      'Pottery Glazes',
      'Pottery Wheels',
      'Modeling Clay'
    ];
    prods.forEach(product => trie.add(product));
    expect(trie.getWords('air')).toEqual([]);
  });
});

describe('Trie operations', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie();
  });

  it('Add and Find Words', () => {
    trie.add('apple');
    trie.add('banana');
    expect(trie.has('apple')).toBe(true);
    expect(trie.has('banana')).toBe(true);
    expect(trie.has('cherry')).toBe(false);
  });

  it('Remove Words', () => {
    trie.add('apple');
    trie.add('banana');
    expect(trie.delete('apple')).toBe(true);
    expect(trie.has('apple')).toBe(false);
    expect(trie.delete('cherry')).toBe(false);
  });

  it('Case Sensitivity', () => {
    const caseInsensitiveTrie = new Trie(['apple', 'Banana'], {
      caseSensitive: false
    });
    expect(caseInsensitiveTrie.has('APPLE')).toBe(true);
    expect(caseInsensitiveTrie.has('banana')).toBe(true);
    expect(caseInsensitiveTrie.has('Cherry')).toBe(false);
  });

  it('Pure Prefix Check', () => {
    trie.add('apple');
    expect(trie.hasPurePrefix('appl')).toBe(true);
    expect(trie.hasPurePrefix('apple')).toBe(false);
  });

  it('Prefix Check', () => {
    trie.add('apple');
    expect(trie.hasPrefix('app')).toBe(true);
    expect(trie.hasPrefix('ban')).toBe(false);
  });

  it('Common Prefix Check', () => {
    trie.add('apple');
    trie.add('appetizer');
    expect(trie.hasCommonPrefix('app')).toBe(true);
    expect(trie.hasCommonPrefix('apple')).toBe(false);
  });

  it('Longest Common Prefix', () => {
    trie.add('apple');
    trie.add('appetizer');
    expect(trie.getLongestCommonPrefix()).toBe('app');
  });

  it('Get Words by Prefix', () => {
    trie.add('apple');
    trie.add('appetizer');
    trie.add('banana');
    const words = trie.getWords('app', 2); // Get at most 2 words with the prefix 'app'
    expect(words).toEqual(['apple', 'appetizer']);
  });

  it('Get no words when prefix not found, with no match from the first character', () => {
    trie.add('apple');
    trie.add('appetizer');
    trie.add('banana');
    const words = trie.getWords('cd');
    expect(words).toEqual([]);
  });

  it('Get no words when prefix not found, with no match from the second character', () => {
    trie.add('apple');
    trie.add('appetizer');
    trie.add('banana');
    const words = trie.getWords('ab');
    expect(words).toEqual([]);
  });

  it('Tree Height', () => {
    trie.add('apple');
    trie.add('banana');
    expect(trie.getHeight()).toBe(6); // Assuming 'apple' and 'banana' are the longest words.
  });
});

describe('Trie class', () => {
  let trie: Trie;
  beforeEach(() => {
    trie = new Trie(['apple', 'app', 'banana', 'band', 'bandana']);
  });

  it('[Symbol.iterator] should iterate over all words', () => {
    const words = [...trie];
    expect(words).toEqual(['app', 'apple', 'banana', 'band', 'bandana']);
  });

  it('forEach should execute a callback for each word', () => {
    const mockCallback = jest.fn();
    trie.forEach(mockCallback);
    expect(mockCallback).toHaveBeenCalledTimes(5);
  });

  it('filter should return words that satisfy the predicate', () => {
    const filteredWords = trie.filter(word => word.startsWith('ba'));
    expect([...filteredWords]).toEqual(['banana', 'band', 'bandana']);
  });

  it('map should apply a function to each word', () => {
    const mappedWords = trie.map(word => word.length.toString());
    expect([...mappedWords]).toEqual(['3', '5', '6', '4', '7']);
  });

  it('reduce should reduce the words to a single value', () => {
    const concatenatedWords = trie.reduce((acc, word) => acc + word, '');
    expect(concatenatedWords).toEqual('appapplebananabandbandana');
  });

  it('reduce should new Trie with toElementFn be correct', () => {
    const trieB = new Trie([{ name: 'apple' }, { name: 'app' }, { name: 'arm' }], { toElementFn: item => item.name });
    expect(trieB.isEmpty()).toBe(false);
    expect(trieB.size).toBe(3);
    expect(trieB.has('apple')).toBe(true);
    expect(trieB.has('app')).toBe(true);
    expect(trieB.has('arm')).toBe(true);
    expect(trieB.hasPrefix('ap')).toBe(true);
    trieB.clear();
    expect(trieB.size).toBe(0);
    expect(trieB.has('apple')).toBe(false);
    expect(trieB.has('app')).toBe(false);
    expect(trieB.has('arm')).toBe(false);
    expect(trieB.hasPrefix('ap')).toBe(false);
  });
});

describe('Trie basic', () => {
  test('Dictionary: Basic word lookup functionality', () => {
    // Initialize a new Trie and add dictionary words
    const dictionary = new Trie<string>();
    const words = ['apple', 'app', 'application', 'approve', 'bread', 'break'];
    words.forEach(word => dictionary.add(word));

    // Test exact word matches
    expect(dictionary.has('apple')).toBe(true);
    expect(dictionary.has('app')).toBe(true);
    expect(dictionary.has('bread')).toBe(true);

    // Test non-existent words
    expect(dictionary.has('appl')).toBe(false);
    expect(dictionary.has('breaking')).toBe(false);

    // Verify dictionary size
    expect(dictionary.size).toBe(words.length);
  });

  test('Autocomplete: Limited suggestions with max results', () => {
    const autocomplete = new Trie<string>();

    // Add city names
    const cities = ['New York', 'New Orleans', 'New Delhi', 'New Jersey', 'New Mexico', 'New Hampshire'];

    cities.forEach(city => autocomplete.add(city));

    // Get limited number of suggestions
    const maxSuggestions = 3;
    const suggestions = autocomplete.getWords('New', maxSuggestions);

    expect(suggestions.length).toBe(maxSuggestions);
    suggestions.forEach(suggestion => {
      expect(suggestion.startsWith('New')).toBe(true);
    });
  });

  test('Dictionary: Word removal and updates', () => {
    const dictionary = new Trie<string>();

    // Add initial words
    dictionary.add('delete');
    dictionary.add('deletion');
    dictionary.add('deleted');

    // Verify initial state
    expect(dictionary.has('delete')).toBe(true);
    expect(dictionary.size).toBe(3);

    // Remove a word
    const deleted = dictionary.delete('delete');
    expect(deleted).toBe(true);
    expect(dictionary.has('delete')).toBe(false);
    expect(dictionary.has('deletion')).toBe(true);
    expect(dictionary.has('deleted')).toBe(true);
    expect(dictionary.size).toBe(2);

    // Try to remove non-existent word
    expect(dictionary.delete('notexist')).toBe(false);
  });
});

describe('classic use', () => {
  test('@example Autocomplete: Prefix validation and checking', () => {
    const autocomplete = new Trie<string>(['gmail.com', 'gmail.co.nz', 'gmail.co.jp', 'yahoo.com', 'outlook.com']);

    // Get all completions for a prefix
    const gmailCompletions = autocomplete.getWords('gmail');
    expect(gmailCompletions).toEqual(['gmail.com', 'gmail.co.nz', 'gmail.co.jp']);
  });

  test('@example File System Path Operations', () => {
    const fileSystem = new Trie<string>([
      '/home/user/documents/file1.txt',
      '/home/user/documents/file2.txt',
      '/home/user/pictures/photo.jpg',
      '/home/user/pictures/vacation/',
      '/home/user/downloads'
    ]);

    // Find common directory prefix
    expect(fileSystem.getLongestCommonPrefix()).toBe('/home/user/');

    // List all files in a directory
    const documentsFiles = fileSystem.getWords('/home/user/documents/');
    expect(documentsFiles).toEqual(['/home/user/documents/file1.txt', '/home/user/documents/file2.txt']);
  });

  test('@example Autocomplete: Basic word suggestions', () => {
    // Create a trie for autocomplete
    const autocomplete = new Trie<string>([
      'function',
      'functional',
      'functions',
      'class',
      'classes',
      'classical',
      'closure',
      'const',
      'constructor'
    ]);

    // Test autocomplete with different prefixes
    expect(autocomplete.getWords('fun')).toEqual(['functional', 'functions', 'function']);
    expect(autocomplete.getWords('cla')).toEqual(['classes', 'classical', 'class']);
    expect(autocomplete.getWords('con')).toEqual(['constructor', 'const']);

    // Test with non-matching prefix
    expect(autocomplete.getWords('xyz')).toEqual([]);
  });

  test('@example Dictionary: Case-insensitive word lookup', () => {
    // Create a case-insensitive dictionary
    const dictionary = new Trie<string>([], { caseSensitive: false });

    // Add words with mixed casing
    dictionary.add('Hello');
    dictionary.add('WORLD');
    dictionary.add('JavaScript');

    // Test lookups with different casings
    expect(dictionary.has('hello')).toBe(true);
    expect(dictionary.has('HELLO')).toBe(true);
    expect(dictionary.has('Hello')).toBe(true);
    expect(dictionary.has('javascript')).toBe(true);
    expect(dictionary.has('JAVASCRIPT')).toBe(true);
  });

  test('@example IP Address Routing Table', () => {
    // Add IP address prefixes and their corresponding routes
    const routes = {
      '192.168.1': 'LAN_SUBNET_1',
      '192.168.2': 'LAN_SUBNET_2',
      '10.0.0': 'PRIVATE_NETWORK_1',
      '10.0.1': 'PRIVATE_NETWORK_2'
    };

    const ipRoutingTable = new Trie<string>(Object.keys(routes));

    // Check IP address prefix matching
    expect(ipRoutingTable.hasPrefix('192.168.1')).toBe(true);
    expect(ipRoutingTable.hasPrefix('192.168.2')).toBe(true);

    // Validate IP address belongs to subnet
    const ip = '192.168.1.100';
    const subnet = ip.split('.').slice(0, 3).join('.');
    expect(ipRoutingTable.hasPrefix(subnet)).toBe(true);
  });
});

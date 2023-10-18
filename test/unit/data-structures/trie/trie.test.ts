import {Trie, TrieNode} from '../../../../src';

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

  it('should remove words from Trie', () => {
    const trie = new Trie();
    trie.add('apple');
    trie.add('app');
    expect(trie.has('apple')).toBe(true);
    trie.remove('apple');
    expect(trie.has('apple')).toBe(false);
    expect(trie.has('app')).toBe(true);
    trie.remove('app');
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

  test('Add and Find Words', () => {
    trie.add('apple');
    trie.add('banana');
    expect(trie.has('apple')).toBe(true);
    expect(trie.has('banana')).toBe(true);
    expect(trie.has('cherry')).toBe(false);
  });

  test('Remove Words', () => {
    trie.add('apple');
    trie.add('banana');
    expect(trie.remove('apple')).toBe(true);
    expect(trie.has('apple')).toBe(false);
    expect(trie.remove('cherry')).toBe(false);
  });

  test('Case Sensitivity', () => {
    const caseInsensitiveTrie = new Trie(['apple', 'Banana'], false);
    expect(caseInsensitiveTrie.has('APPLE')).toBe(true);
    expect(caseInsensitiveTrie.has('banana')).toBe(true);
    expect(caseInsensitiveTrie.has('Cherry')).toBe(false);
  });

  test('Pure Prefix Check', () => {
    trie.add('apple');
    expect(trie.hasPurePrefix('appl')).toBe(true);
    expect(trie.hasPurePrefix('apple')).toBe(false);
  });

  test('Prefix Check', () => {
    trie.add('apple');
    expect(trie.hasPrefix('app')).toBe(true);
    expect(trie.hasPrefix('ban')).toBe(false);
  });

  test('Common Prefix Check', () => {
    trie.add('apple');
    trie.add('appetizer');
    expect(trie.hasCommonPrefix('app')).toBe(true);
    expect(trie.hasCommonPrefix('apple')).toBe(false);
  });

  test('Longest Common Prefix', () => {
    trie.add('apple');
    trie.add('appetizer');
    expect(trie.getLongestCommonPrefix()).toBe('app');
  });

  test('Get Words by Prefix', () => {
    trie.add('apple');
    trie.add('appetizer');
    trie.add('banana');
    const words = trie.getWords('app', 2); // Get at most 2 words with the prefix 'app'
    expect(words).toEqual(['apple', 'appetizer']);
  });

  test('Tree Height', () => {
    trie.add('apple');
    trie.add('banana');
    expect(trie.getHeight()).toBe(6); // Assuming 'apple' and 'banana' are the longest words.
  });
});

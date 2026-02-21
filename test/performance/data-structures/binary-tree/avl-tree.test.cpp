#include <benchmark/benchmark.h>
#include <set>
#include <vector>
#include <random>

const int HUNDRED_THOUSAND = 100000;
const int MILLION = 1000000;

// Keep rangeSearch reasonably fast by default.
// Env overrides could be added later if needed, but keep this stable for now.
const int RANGESEARCH_N = HUNDRED_THOUSAND;
const int RANGESEARCH_QUERY_COUNT = HUNDRED_THOUSAND;
const int RANGESEARCH_RANGE_SIZE = 100;

// Global random number generator
std::mt19937 gen(std::random_device{}());
std::uniform_int_distribution<> dis_100k(0, HUNDRED_THOUSAND - 1);
std::uniform_int_distribution<> dis_1m(0, MILLION - 1);

// Generate random array
std::vector<int> generateRandomArray(int size, int max_value) {
  std::vector<int> arr;
  arr.reserve(size);
  std::uniform_int_distribution<> dist(0, max_value - 1);
  for (int i = 0; i < size; i++) {
    arr.push_back(dist(gen));
  }
  return arr;
}

static const auto randomArray100k = generateRandomArray(HUNDRED_THOUSAND, HUNDRED_THOUSAND);
static const auto randomArray1m = generateRandomArray(MILLION, MILLION);
static const auto randomArrayRangeSearch = generateRandomArray(RANGESEARCH_N, RANGESEARCH_N);

// Global trees (pre-built once for get/getNode/iterator tests)
static std::set<int> treeForGet;
static std::set<int> treeForIterator;
static std::set<int> treeForRangeSearch;
static bool treesInitialized = false;

void initializeTrees() {
  if (!treesInitialized) {
    // Initialize 100K trees
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      treeForGet.insert(randomArray100k[i]);
      treeForIterator.insert(randomArray100k[i]);
    }

    // Initialize rangeSearch tree (default: 100K)
    for (int i = 0; i < RANGESEARCH_N; i++) {
      treeForRangeSearch.insert(randomArrayRangeSearch[i]);
    }

    treesInitialized = true;
  }
}

// Test 1: 100K add randomly
static void AddRandomly100K(benchmark::State& state) {
  for (auto _ : state) {
    std::set<int> tree;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      tree.insert(randomArray100k[i]);
    }
    benchmark::DoNotOptimize(tree);
  }
}
BENCHMARK(AddRandomly100K)->Name("100K add randomly");

// Test 2: 100K add (sequential)
static void Add100K(benchmark::State& state) {
  for (auto _ : state) {
    std::set<int> tree;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      tree.insert(i);
    }
    benchmark::DoNotOptimize(tree);
  }
}
BENCHMARK(Add100K)->Name("100K add");

// Test 3: 100K get
static void Get100K(benchmark::State& state) {
  initializeTrees();
  for (auto _ : state) {
    int count = 0;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      auto it = treeForGet.find(randomArray100k[i]);
      if (it != treeForGet.end()) {
        count++;
      }
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(Get100K)->Name("100K get");

// Test 4: 100K getNode (same as get for std::set)
static void GetNode100K(benchmark::State& state) {
  initializeTrees();
  for (auto _ : state) {
    int count = 0;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      auto it = treeForGet.find(randomArray100k[i]);
      if (it != treeForGet.end()) {
        count++;
      }
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(GetNode100K)->Name("100K getNode");

// Test 5: 100K iterator
static void Iterator100K(benchmark::State& state) {
  initializeTrees();
  for (auto _ : state) {
    int count = 0;
    for (auto it = treeForIterator.begin(); it != treeForIterator.end(); ++it) {
      count++;
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(Iterator100K)->Name("100K iterator");

// Test 6: 100K add & delete (sequential)
static void AddDeleteOrderly100K(benchmark::State& state) {
  for (auto _ : state) {
    std::set<int> tree;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      tree.insert(i);
    }
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      tree.erase(i);
    }
    benchmark::DoNotOptimize(tree);
  }
}
BENCHMARK(AddDeleteOrderly100K)->Name("100K add & delete orderly");

// Test 7: 100K add & delete (random)
static void AddDeleteRandomly100K(benchmark::State& state) {
  for (auto _ : state) {
    std::set<int> tree;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      tree.insert(randomArray100k[i]);
    }
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      tree.erase(randomArray100k[i]);
    }
    benchmark::DoNotOptimize(tree);
  }
}
BENCHMARK(AddDeleteRandomly100K)->Name("100K add & delete randomly");

// Test 8: rangeSearch queries (default: 100K queries on 100K data)
static void RangeSearch100K(benchmark::State& state) {
  initializeTrees();

  for (auto _ : state) {
    int totalResults = 0;
    for (int i = 0; i < RANGESEARCH_QUERY_COUNT; i++) {
      int min = (i * 12345) % (RANGESEARCH_N - RANGESEARCH_RANGE_SIZE);
      int max = min + RANGESEARCH_RANGE_SIZE;

      auto it_begin = treeForRangeSearch.lower_bound(min);
      auto it_end = treeForRangeSearch.upper_bound(max);

      int count = 0;
      for (auto it = it_begin; it != it_end; ++it) {
        count++;
      }
      totalResults += count;
    }
    benchmark::DoNotOptimize(totalResults);
  }
}
BENCHMARK(RangeSearch100K)->Name("AVL Tree 100K rangeSearch queries");

BENCHMARK_MAIN();
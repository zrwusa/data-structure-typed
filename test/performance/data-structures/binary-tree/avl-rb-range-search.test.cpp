#include <benchmark/benchmark.h>
#include <set>
#include <random>
#include <vector>

const int MILLION = 1000000;
const int HUNDRED_THOUSAND = 100000;

// Global random number generator
std::mt19937 gen(std::random_device{}());
std::uniform_int_distribution<> dis(0, MILLION - 1);

// Generate random array
std::vector<int> generateRandomArray(int size) {
  std::vector<int> arr;
  arr.reserve(size);
  for (int i = 0; i < size; i++) {
    arr.push_back(dis(gen));
  }
  return arr;
}

static const auto randomArray = generateRandomArray(MILLION);

// Pre-built trees
static std::set<int> avlTree100K;
static std::set<int> rbTree1M;
static bool treesInitialized = false;

void initializeTrees() {
  if (!treesInitialized) {
    // Build 100K tree
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      avlTree100K.insert(randomArray[i]);
    }
    // Build 1M tree
    for (int i = 0; i < MILLION; i++) {
      rbTree1M.insert(randomArray[i]);
    }
    treesInitialized = true;
  }
}

std::string formatNumber(int num) {
  std::string result = std::to_string(num);
  int n = result.length() - 3;
  while (n > 0) {
    result.insert(n, ",");
    n -= 3;
  }
  return result;
}

// Test 1: AVL Tree (std::set) 100K rangeSearch
static void AVLRangeSearch100K(benchmark::State& state) {
  initializeTrees();
  for (auto _ : state) {
    // Range search [69900, 70000]
    auto it_begin = avlTree100K.lower_bound(69900);
    auto it_end = avlTree100K.upper_bound(70000);

    int count = 0;
    for (auto it = it_begin; it != it_end; ++it) {
      count++;
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(AVLRangeSearch100K)->Name("AVL Tree " + formatNumber(HUNDRED_THOUSAND) + " rangeSearch");

// Test 2: Red-Black Tree (std::set) 1M rangeSearch
static void RBRangeSearch1M(benchmark::State& state) {
  initializeTrees();
  for (auto _ : state) {
    // Range search [69900, 70000]
    auto it_begin = rbTree1M.lower_bound(69900);
    auto it_end = rbTree1M.upper_bound(70000);

    int count = 0;
    for (auto it = it_begin; it != it_end; ++it) {
      count++;
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(RBRangeSearch1M)->Name("Red-Black Tree " + formatNumber(MILLION) + " rangeSearch");

// Test 3: AVL Tree 100K add (for completeness)
static void AVLAdd100K(benchmark::State& state) {
  for (auto _ : state) {
    std::set<int> tree;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      tree.insert(randomArray[i]);
    }
    benchmark::DoNotOptimize(tree);
  }
}
BENCHMARK(AVLAdd100K)->Name("AVL Tree " + formatNumber(HUNDRED_THOUSAND) + " add");

// Test 4: Red-Black Tree 1M add (for completeness)
static void RBAdd1M(benchmark::State& state) {
  for (auto _ : state) {
    std::set<int> tree;
    for (int i = 0; i < MILLION; i++) {
      tree.insert(randomArray[i]);
    }
    benchmark::DoNotOptimize(tree);
  }
}
BENCHMARK(RBAdd1M)->Name("Red-Black Tree " + formatNumber(MILLION) + " add");

BENCHMARK_MAIN();

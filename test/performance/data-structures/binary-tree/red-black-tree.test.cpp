#include <benchmark/benchmark.h>
#include <map>
#include <set>
#include <vector>
#include <random>
#include <string>
#include <cstdint>

static const int MILLION = 1000000;
static const int KEY_POOL = 100000;
static const int RANGE_SIZE = 10;

std::string formatNumber(int num) {
  std::string result = std::to_string(num);
  int n = (int)result.length() - 3;
  while (n > 0) {
    result.insert(n, ",");
    n -= 3;
  }
  return result;
}

// Global RNG
static std::mt19937 gen(std::random_device{}());

static std::vector<int> generateRandomArray(int size, int max_value) {
  std::vector<int> arr;
  arr.reserve(size);
  std::uniform_int_distribution<> dist(0, max_value - 1);
  for (int i = 0; i < size; i++) arr.push_back(dist(gen));
  return arr;
}

// Random keys used across tests (generated once, not timed)
static const auto randUniqueKeys = generateRandomArray(MILLION, MILLION);
static const auto randUpdateKeys = generateRandomArray(MILLION, KEY_POOL);

// Tree for rangeSearch (built once)
static std::map<int, int> treeForRangeSearch;
static bool treeInitialized = false;

static void initializeTree() {
  if (!treeInitialized) {
    for (int i = 0; i < MILLION; i++) {
      treeForRangeSearch[randUniqueKeys[i]] = randUniqueKeys[i];
    }
    treeInitialized = true;
  }
}

// -----------------
// UPDATE (SEQ)
// -----------------
static void UpdSeq1M(benchmark::State& state) {
  for (auto _ : state) {
    std::map<int,int> mp;
    for (int i = 0; i < KEY_POOL; i++) mp[i] = 0;
    for (int i = 0; i < MILLION; i++) mp[i % KEY_POOL] = i;
    benchmark::DoNotOptimize(mp);
  }
}
BENCHMARK(UpdSeq1M)->Name(formatNumber(MILLION) + " upd SEQ");

static void UpdSeq1M_NodeMode(benchmark::State& state) {
  // Node Mode JS still updates node.value, so std::map is the closest native analogue.
  for (auto _ : state) {
    std::map<int,int> mp;
    for (int i = 0; i < KEY_POOL; i++) mp[i] = 0;
    for (int i = 0; i < MILLION; i++) mp[i % KEY_POOL] = i;
    benchmark::DoNotOptimize(mp);
  }
}
BENCHMARK(UpdSeq1M_NodeMode)->Name(formatNumber(MILLION) + " upd SEQ (Node Mode)");

// -----------------
// UPDATE (RAND)
// -----------------
static void UpdRand1M(benchmark::State& state) {
  for (auto _ : state) {
    std::map<int,int> mp;
    for (int i = 0; i < KEY_POOL; i++) mp[i] = 0;
    for (int i = 0; i < MILLION; i++) mp[randUpdateKeys[i]] = i;
    benchmark::DoNotOptimize(mp);
  }
}
BENCHMARK(UpdRand1M)->Name(formatNumber(MILLION) + " upd RAND");

static void UpdRand1M_NodeMode(benchmark::State& state) {
  for (auto _ : state) {
    std::map<int,int> mp;
    for (int i = 0; i < KEY_POOL; i++) mp[i] = 0;
    for (int i = 0; i < MILLION; i++) mp[randUpdateKeys[i]] = i;
    benchmark::DoNotOptimize(mp);
  }
}
BENCHMARK(UpdRand1M_NodeMode)->Name(formatNumber(MILLION) + " upd RAND (Node Mode)");

// -----------------
// INSERT (SEQ)
// -----------------
static void InsSeq1M(benchmark::State& state) {
  for (auto _ : state) {
    std::map<int,int> mp;
    for (int i = 0; i < MILLION; i++) mp[i] = i;
    benchmark::DoNotOptimize(mp);
  }
}
BENCHMARK(InsSeq1M)->Name(formatNumber(MILLION) + " ins SEQ");

static void InsSeq1M_NodeMode(benchmark::State& state) {
  for (auto _ : state) {
    std::set<int> st;
    for (int i = 0; i < MILLION; i++) st.insert(i);
    benchmark::DoNotOptimize(st);
  }
}
BENCHMARK(InsSeq1M_NodeMode)->Name(formatNumber(MILLION) + " ins SEQ (Node Mode)");

// -----------------
// INSERT (RAND unique)
// -----------------
static void InsRand1M(benchmark::State& state) {
  for (auto _ : state) {
    std::map<int,int> mp;
    for (int i = 0; i < MILLION; i++) {
      const int k = randUniqueKeys[i];
      mp[k] = k;
    }
    benchmark::DoNotOptimize(mp);
  }
}
BENCHMARK(InsRand1M)->Name(formatNumber(MILLION) + " ins RAND");

static void InsRand1M_NodeMode(benchmark::State& state) {
  for (auto _ : state) {
    std::set<int> st;
    for (int i = 0; i < MILLION; i++) st.insert(randUniqueKeys[i]);
    benchmark::DoNotOptimize(st);
  }
}
BENCHMARK(InsRand1M_NodeMode)->Name(formatNumber(MILLION) + " ins RAND (Node Mode)");

// -----------------
// keys-only baseline
// -----------------
static void KeysOnly1M(benchmark::State& state) {
  for (auto _ : state) {
    int64_t s = 0;
    for (int i = 0; i < MILLION; i++) s += randUniqueKeys[i];
    benchmark::DoNotOptimize(s);
  }
}
BENCHMARK(KeysOnly1M)->Name(formatNumber(MILLION) + " keys-only");

// -----------------
// GET
// -----------------
static void Get1M(benchmark::State& state) {
  std::map<int,int> mp;
  for (int i = 0; i < MILLION; i++) mp[i] = i;

  for (auto _ : state) {
    int count = 0;
    for (int i = 0; i < MILLION; i++) {
      auto it = mp.find(i);
      if (it != mp.end()) count++;
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(Get1M)->Name(formatNumber(MILLION) + " get");

static void Get1M_NodeMode(benchmark::State& state) {
  std::set<int> st;
  for (int i = 0; i < MILLION; i++) st.insert(i);

  for (auto _ : state) {
    int count = 0;
    for (int i = 0; i < MILLION; i++) {
      auto it = st.find(i);
      if (it != st.end()) count++;
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(Get1M_NodeMode)->Name(formatNumber(MILLION) + " get (Node Mode)");

// -----------------
// rangeSearch
// -----------------
static void RangeSearch1M(benchmark::State& state) {
  initializeTree();
  const int QUERY_COUNT = MILLION;

  for (auto _ : state) {
    int totalResults = 0;
    for (int i = 0; i < QUERY_COUNT; i++) {
      int min = i;
      int max = i + RANGE_SIZE;

      auto it_begin = treeForRangeSearch.lower_bound(min);
      auto it_end = treeForRangeSearch.upper_bound(max);

      int count = 0;
      for (auto it = it_begin; it != it_end; ++it) count++;
      totalResults += count;
    }
    benchmark::DoNotOptimize(totalResults);
  }
}
BENCHMARK(RangeSearch1M)->Name("Red-Black Tree 1M rangeSearch queries");

BENCHMARK_MAIN();

#include <benchmark/benchmark.h>
#include <map>
#include <vector>
#include <random>
#include <string>

static const int MILLION = 1000000;
static const int HUNDRED_THOUSAND = 100000;

// Global RNG
static std::mt19937 gen(42);

static std::vector<int> generateRandomArray(int size, int max_value) {
  std::vector<int> arr;
  arr.reserve(size);
  std::uniform_int_distribution<> dist(0, max_value - 1);
  for (int i = 0; i < size; i++) arr.push_back(dist(gen));
  return arr;
}

// Use fewer unique keys to create duplicates (multimap scenario)
static const auto randomKeys = generateRandomArray(MILLION, HUNDRED_THOUSAND);

// Prebuilt multimap for lookup-only benchmarks
static std::multimap<int, int> prebuiltMultiMap;
static bool multiMapInitialized = false;

static void initializeMultiMap() {
  if (!multiMapInitialized) {
    for (int i = 0; i < MILLION; i++) {
      prebuiltMultiMap.insert({randomKeys[i], i});
    }
    multiMapInitialized = true;
  }
}

// -----------------
// ADD (insert with duplicates)
// -----------------
static void Add1M(benchmark::State& state) {
  for (auto _ : state) {
    std::multimap<int, int> mm;
    for (int i = 0; i < MILLION; i++) {
      mm.insert({randomKeys[i], i});
    }
    benchmark::DoNotOptimize(mm);
  }
}
BENCHMARK(Add1M)->Name("1M add std::multimap")->Unit(benchmark::kMillisecond);

// -----------------
// HAS (count > 0)
// -----------------
static void Has1M(benchmark::State& state) {
  initializeMultiMap();
  for (auto _ : state) {
    int found = 0;
    for (int i = 0; i < MILLION; i++) {
      if (prebuiltMultiMap.count(randomKeys[i]) > 0) found++;
    }
    benchmark::DoNotOptimize(found);
  }
}
BENCHMARK(Has1M)->Name("1M has std::multimap")->Unit(benchmark::kMillisecond);

// -----------------
// GET (equal_range iteration)
// -----------------
static void Get1M(benchmark::State& state) {
  initializeMultiMap();
  for (auto _ : state) {
    int sum = 0;
    for (int i = 0; i < MILLION; i++) {
      auto range = prebuiltMultiMap.equal_range(randomKeys[i]);
      for (auto it = range.first; it != range.second; ++it) {
        sum += it->second;
      }
    }
    benchmark::DoNotOptimize(sum);
  }
}
BENCHMARK(Get1M)->Name("1M get std::multimap")->Unit(benchmark::kMillisecond);

// -----------------
// COUNT
// -----------------
static void Count1M(benchmark::State& state) {
  initializeMultiMap();
  for (auto _ : state) {
    size_t total = 0;
    for (int i = 0; i < MILLION; i++) {
      total += prebuiltMultiMap.count(randomKeys[i]);
    }
    benchmark::DoNotOptimize(total);
  }
}
BENCHMARK(Count1M)->Name("1M count std::multimap")->Unit(benchmark::kMillisecond);

// -----------------
// BUILD + HAS
// -----------------
static void BuildHas1M(benchmark::State& state) {
  for (auto _ : state) {
    std::multimap<int, int> mm;
    for (int i = 0; i < MILLION; i++) {
      mm.insert({randomKeys[i], i});
    }
    int found = 0;
    for (int i = 0; i < MILLION; i++) {
      if (mm.count(randomKeys[i]) > 0) found++;
    }
    benchmark::DoNotOptimize(found);
  }
}
BENCHMARK(BuildHas1M)->Name("1M build+has std::multimap")->Unit(benchmark::kMillisecond);

// -----------------
// BUILD + GET
// -----------------
static void BuildGet1M(benchmark::State& state) {
  for (auto _ : state) {
    std::multimap<int, int> mm;
    for (int i = 0; i < MILLION; i++) {
      mm.insert({randomKeys[i], i});
    }
    int sum = 0;
    for (int i = 0; i < MILLION; i++) {
      auto range = mm.equal_range(randomKeys[i]);
      for (auto it = range.first; it != range.second; ++it) {
        sum += it->second;
      }
    }
    benchmark::DoNotOptimize(sum);
  }
}
BENCHMARK(BuildGet1M)->Name("1M build+get std::multimap")->Unit(benchmark::kMillisecond);

// -----------------
// FIRST/LAST ENTRY
// -----------------
static void FirstLast100K(benchmark::State& state) {
  initializeMultiMap();
  for (auto _ : state) {
    int sum = 0;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      auto first = prebuiltMultiMap.begin();
      auto last = prebuiltMultiMap.rbegin();
      if (first != prebuiltMultiMap.end()) sum += first->second;
      sum += last->second;
    }
    benchmark::DoNotOptimize(sum);
  }
}
BENCHMARK(FirstLast100K)->Name("100K first/last std::multimap")->Unit(benchmark::kMillisecond);

// -----------------
// CEILING/FLOOR (lower_bound/upper_bound)
// -----------------
static void CeilingFloor100K(benchmark::State& state) {
  initializeMultiMap();
  for (auto _ : state) {
    int sum = 0;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      // ceiling = lower_bound
      auto ceiling = prebuiltMultiMap.lower_bound(i);
      // floor = --upper_bound (if not begin)
      auto floor = prebuiltMultiMap.upper_bound(i);
      if (floor != prebuiltMultiMap.begin()) --floor;
      
      if (ceiling != prebuiltMultiMap.end()) sum += ceiling->second;
      sum += floor->second;
    }
    benchmark::DoNotOptimize(sum);
  }
}
BENCHMARK(CeilingFloor100K)->Name("100K ceiling/floor std::multimap")->Unit(benchmark::kMillisecond);

// -----------------
// ITERATION (all entries)
// -----------------
static void Iterate1M(benchmark::State& state) {
  initializeMultiMap();
  for (auto _ : state) {
    int sum = 0;
    for (const auto& [k, v] : prebuiltMultiMap) {
      sum += v;
    }
    benchmark::DoNotOptimize(sum);
  }
}
BENCHMARK(Iterate1M)->Name("1M iterate std::multimap")->Unit(benchmark::kMillisecond);

// -----------------
// SIZE
// -----------------
static void Size1M(benchmark::State& state) {
  initializeMultiMap();
  for (auto _ : state) {
    size_t s = prebuiltMultiMap.size();
    benchmark::DoNotOptimize(s);
  }
}
BENCHMARK(Size1M)->Name("1M size std::multimap")->Unit(benchmark::kMillisecond);

BENCHMARK_MAIN();

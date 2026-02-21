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

static const auto randomKeys = generateRandomArray(MILLION, MILLION - 1);

// Prebuilt map for lookup-only benchmarks
static std::map<int, int> prebuiltMap;
static bool mapInitialized = false;

static void initializeMap() {
  if (!mapInitialized) {
    for (int i = 0; i < MILLION; i++) {
      prebuiltMap[randomKeys[i]] = randomKeys[i];
    }
    mapInitialized = true;
  }
}

// -----------------
// SET (insert)
// -----------------
static void Set1M(benchmark::State& state) {
  for (auto _ : state) {
    std::map<int, int> mp;
    for (int i = 0; i < MILLION; i++) {
      mp[randomKeys[i]] = randomKeys[i];
    }
    benchmark::DoNotOptimize(mp);
  }
}
BENCHMARK(Set1M)->Name("1M set std::map")->Unit(benchmark::kMillisecond);

// -----------------
// GET (lookup-only)
// -----------------
static void Get1M(benchmark::State& state) {
  initializeMap();
  for (auto _ : state) {
    int sum = 0;
    for (int i = 0; i < MILLION; i++) {
      auto it = prebuiltMap.find(randomKeys[i]);
      if (it != prebuiltMap.end()) sum += it->second;
    }
    benchmark::DoNotOptimize(sum);
  }
}
BENCHMARK(Get1M)->Name("1M get std::map")->Unit(benchmark::kMillisecond);

// -----------------
// BUILD + GET
// -----------------
static void BuildGet1M(benchmark::State& state) {
  for (auto _ : state) {
    std::map<int, int> mp;
    for (int i = 0; i < MILLION; i++) {
      mp[randomKeys[i]] = randomKeys[i];
    }
    int sum = 0;
    for (int i = 0; i < MILLION; i++) {
      auto it = mp.find(randomKeys[i]);
      if (it != mp.end()) sum += it->second;
    }
    benchmark::DoNotOptimize(sum);
  }
}
BENCHMARK(BuildGet1M)->Name("1M build+get std::map")->Unit(benchmark::kMillisecond);

// -----------------
// RANGE SEARCH (using lower_bound/upper_bound)
// -----------------
static void RangeSearch100K(benchmark::State& state) {
  initializeMap();
  for (auto _ : state) {
    int count = 0;
    auto lo = prebuiltMap.lower_bound(0);
    auto hi = prebuiltMap.upper_bound(HUNDRED_THOUSAND - 1);
    for (auto it = lo; it != hi; ++it) {
      count++;
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(RangeSearch100K)->Name("100K rangeSearch std::map")->Unit(benchmark::kMillisecond);

// -----------------
// NAVIGABLE (ceiling/floor/higher/lower equivalent)
// -----------------
static void Navigable100K(benchmark::State& state) {
  initializeMap();
  for (auto _ : state) {
    int sum = 0;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      // lower_bound = ceiling
      auto ceiling = prebuiltMap.lower_bound(i);
      // floor = --upper_bound (if not begin)
      auto floor = prebuiltMap.upper_bound(i);
      if (floor != prebuiltMap.begin()) --floor;
      // higher = upper_bound
      auto higher = prebuiltMap.upper_bound(i);
      // lower = --lower_bound (if not begin)
      auto lower = prebuiltMap.lower_bound(i);
      if (lower != prebuiltMap.begin()) --lower;
      
      if (ceiling != prebuiltMap.end()) sum += ceiling->second;
      if (higher != prebuiltMap.end()) sum += higher->second;
    }
    benchmark::DoNotOptimize(sum);
  }
}
BENCHMARK(Navigable100K)->Name("100K navigable std::map")->Unit(benchmark::kMillisecond);

BENCHMARK_MAIN();

#include <benchmark/benchmark.h>
#include <set>
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

// Prebuilt set for lookup-only benchmarks
static std::set<int> prebuiltSet;
static bool setInitialized = false;

static void initializeSet() {
  if (!setInitialized) {
    for (int i = 0; i < MILLION; i++) {
      prebuiltSet.insert(randomKeys[i]);
    }
    setInitialized = true;
  }
}

// -----------------
// ADD (insert)
// -----------------
static void Add1M(benchmark::State& state) {
  for (auto _ : state) {
    std::set<int> st;
    for (int i = 0; i < MILLION; i++) {
      st.insert(randomKeys[i]);
    }
    benchmark::DoNotOptimize(st);
  }
}
BENCHMARK(Add1M)->Name("1M add std::set")->Unit(benchmark::kMillisecond);

// -----------------
// HAS (find, lookup-only)
// -----------------
static void Has1M(benchmark::State& state) {
  initializeSet();
  for (auto _ : state) {
    int count = 0;
    for (int i = 0; i < MILLION; i++) {
      if (prebuiltSet.find(randomKeys[i]) != prebuiltSet.end()) count++;
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(Has1M)->Name("1M has std::set")->Unit(benchmark::kMillisecond);

// -----------------
// BUILD + HAS
// -----------------
static void BuildHas1M(benchmark::State& state) {
  for (auto _ : state) {
    std::set<int> st;
    for (int i = 0; i < MILLION; i++) {
      st.insert(randomKeys[i]);
    }
    int count = 0;
    for (int i = 0; i < MILLION; i++) {
      if (st.find(randomKeys[i]) != st.end()) count++;
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(BuildHas1M)->Name("1M build+has std::set")->Unit(benchmark::kMillisecond);

// -----------------
// RANGE SEARCH (using lower_bound/upper_bound)
// -----------------
static void RangeSearch100K(benchmark::State& state) {
  initializeSet();
  for (auto _ : state) {
    int count = 0;
    auto lo = prebuiltSet.lower_bound(0);
    auto hi = prebuiltSet.upper_bound(HUNDRED_THOUSAND - 1);
    for (auto it = lo; it != hi; ++it) {
      count++;
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(RangeSearch100K)->Name("100K rangeSearch std::set")->Unit(benchmark::kMillisecond);

// -----------------
// NAVIGABLE (ceiling/floor/higher/lower equivalent)
// -----------------
static void Navigable100K(benchmark::State& state) {
  initializeSet();
  for (auto _ : state) {
    int sum = 0;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      // lower_bound = ceiling
      auto ceiling = prebuiltSet.lower_bound(i);
      // floor = --upper_bound (if not begin)
      auto floor = prebuiltSet.upper_bound(i);
      if (floor != prebuiltSet.begin()) --floor;
      // higher = upper_bound
      auto higher = prebuiltSet.upper_bound(i);
      // lower = --lower_bound (if not begin)
      auto lower = prebuiltSet.lower_bound(i);
      if (lower != prebuiltSet.begin()) --lower;
      
      if (ceiling != prebuiltSet.end()) sum += *ceiling;
      if (higher != prebuiltSet.end()) sum += *higher;
    }
    benchmark::DoNotOptimize(sum);
  }
}
BENCHMARK(Navigable100K)->Name("100K navigable std::set")->Unit(benchmark::kMillisecond);

BENCHMARK_MAIN();

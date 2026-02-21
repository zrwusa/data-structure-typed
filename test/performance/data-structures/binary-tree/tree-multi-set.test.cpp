#include <benchmark/benchmark.h>
#include <set>
#include <vector>
#include <random>

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

// Use fewer unique keys to create duplicates (multiset scenario)
static const auto randomKeys = generateRandomArray(MILLION, HUNDRED_THOUSAND);

// Prebuilt multiset for lookup-only benchmarks
static std::multiset<int> prebuiltMultiSet;
static bool multiSetInitialized = false;

static void initializeMultiSet() {
  if (!multiSetInitialized) {
    for (int i = 0; i < MILLION; i++) {
      prebuiltMultiSet.insert(randomKeys[i]);
    }
    multiSetInitialized = true;
  }
}

// -----------------
// ADD (insert with duplicates)
// -----------------
static void Add1M(benchmark::State& state) {
  for (auto _ : state) {
    std::multiset<int> ms;
    for (int i = 0; i < MILLION; i++) {
      ms.insert(randomKeys[i]);
    }
    benchmark::DoNotOptimize(ms);
  }
}
BENCHMARK(Add1M)->Name("1M add std::multiset")->Unit(benchmark::kMillisecond);

// -----------------
// HAS (count > 0)
// -----------------
static void Has1M(benchmark::State& state) {
  initializeMultiSet();
  for (auto _ : state) {
    int found = 0;
    for (int i = 0; i < MILLION; i++) {
      if (prebuiltMultiSet.count(randomKeys[i]) > 0) found++;
    }
    benchmark::DoNotOptimize(found);
  }
}
BENCHMARK(Has1M)->Name("1M has std::multiset")->Unit(benchmark::kMillisecond);

// -----------------
// COUNT
// -----------------
static void Count1M(benchmark::State& state) {
  initializeMultiSet();
  for (auto _ : state) {
    size_t total = 0;
    for (int i = 0; i < MILLION; i++) {
      total += prebuiltMultiSet.count(randomKeys[i]);
    }
    benchmark::DoNotOptimize(total);
  }
}
BENCHMARK(Count1M)->Name("1M count std::multiset")->Unit(benchmark::kMillisecond);

// -----------------
// BUILD + HAS
// -----------------
static void BuildHas1M(benchmark::State& state) {
  for (auto _ : state) {
    std::multiset<int> ms;
    for (int i = 0; i < MILLION; i++) {
      ms.insert(randomKeys[i]);
    }
    int found = 0;
    for (int i = 0; i < MILLION; i++) {
      if (ms.count(randomKeys[i]) > 0) found++;
    }
    benchmark::DoNotOptimize(found);
  }
}
BENCHMARK(BuildHas1M)->Name("1M build+has std::multiset")->Unit(benchmark::kMillisecond);

// -----------------
// BUILD + COUNT
// -----------------
static void BuildCount1M(benchmark::State& state) {
  for (auto _ : state) {
    std::multiset<int> ms;
    for (int i = 0; i < MILLION; i++) {
      ms.insert(randomKeys[i]);
    }
    size_t total = 0;
    for (int i = 0; i < MILLION; i++) {
      total += ms.count(randomKeys[i]);
    }
    benchmark::DoNotOptimize(total);
  }
}
BENCHMARK(BuildCount1M)->Name("1M build+count std::multiset")->Unit(benchmark::kMillisecond);

// -----------------
// DELETE ONE (erase single occurrence)
// -----------------
static void DeleteOne100K(benchmark::State& state) {
  for (auto _ : state) {
    std::multiset<int> ms;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      ms.insert(randomKeys[i]);
    }
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      auto it = ms.find(randomKeys[i]);
      if (it != ms.end()) ms.erase(it);
    }
    benchmark::DoNotOptimize(ms);
  }
}
BENCHMARK(DeleteOne100K)->Name("100K delete-one std::multiset")->Unit(benchmark::kMillisecond);

// -----------------
// FIRST/LAST
// -----------------
static void FirstLast100K(benchmark::State& state) {
  initializeMultiSet();
  for (auto _ : state) {
    int sum = 0;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      auto first = *prebuiltMultiSet.begin();
      auto last = *prebuiltMultiSet.rbegin();
      sum += first + last;
    }
    benchmark::DoNotOptimize(sum);
  }
}
BENCHMARK(FirstLast100K)->Name("100K first/last std::multiset")->Unit(benchmark::kMillisecond);

// -----------------
// CEILING/FLOOR (lower_bound/upper_bound)
// -----------------
static void CeilingFloor100K(benchmark::State& state) {
  initializeMultiSet();
  for (auto _ : state) {
    int sum = 0;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      // ceiling = lower_bound
      auto ceiling = prebuiltMultiSet.lower_bound(i);
      // floor = --upper_bound (if not begin)
      auto floor = prebuiltMultiSet.upper_bound(i);
      if (floor != prebuiltMultiSet.begin()) --floor;
      
      if (ceiling != prebuiltMultiSet.end()) sum += *ceiling;
      sum += *floor;
    }
    benchmark::DoNotOptimize(sum);
  }
}
BENCHMARK(CeilingFloor100K)->Name("100K ceiling/floor std::multiset")->Unit(benchmark::kMillisecond);

// -----------------
// ITERATION (expanded - all elements)
// -----------------
static void Iterate1M(benchmark::State& state) {
  initializeMultiSet();
  for (auto _ : state) {
    int sum = 0;
    for (const auto& v : prebuiltMultiSet) {
      sum += v;
    }
    benchmark::DoNotOptimize(sum);
  }
}
BENCHMARK(Iterate1M)->Name("1M iterate std::multiset")->Unit(benchmark::kMillisecond);

// -----------------
// SIZE
// -----------------
static void Size1M(benchmark::State& state) {
  initializeMultiSet();
  for (auto _ : state) {
    size_t s = prebuiltMultiSet.size();
    benchmark::DoNotOptimize(s);
  }
}
BENCHMARK(Size1M)->Name("1M size std::multiset")->Unit(benchmark::kMillisecond);

// -----------------
// DISTINCT SIZE (unique element count - need to iterate)
// -----------------
static void DistinctSize1M(benchmark::State& state) {
  initializeMultiSet();
  for (auto _ : state) {
    size_t distinct = 0;
    auto it = prebuiltMultiSet.begin();
    while (it != prebuiltMultiSet.end()) {
      distinct++;
      it = prebuiltMultiSet.upper_bound(*it);
    }
    benchmark::DoNotOptimize(distinct);
  }
}
BENCHMARK(DistinctSize1M)->Name("1M distinctSize std::multiset")->Unit(benchmark::kMillisecond);

BENCHMARK_MAIN();

#include <benchmark/benchmark.h>
#include <list>

const int HUNDRED_THOUSAND = 100000;

// Test 1: 100k push
static void Push1M(benchmark::State& state) {
  for (auto _ : state) {
    std::list<int> list;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      list.push_back(i);
    }
    benchmark::DoNotOptimize(list);
  }
}
BENCHMARK(Push1M)->Name("100k push");

// Test 2: 100k unshift
static void Unshift1M(benchmark::State& state) {
  for (auto _ : state) {
    std::list<int> list;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      list.push_front(i);
    }
    benchmark::DoNotOptimize(list);
  }
}
BENCHMARK(Unshift1M)->Name("100k unshift");

// Test 3: 100k unshift & shift
static void UnshiftAndShift1M(benchmark::State& state) {
  for (auto _ : state) {
    std::list<int> list;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      list.push_front(i);
    }
    while (!list.empty()) {
      list.pop_front();
    }
    benchmark::DoNotOptimize(list);
  }
}
BENCHMARK(UnshiftAndShift1M)->Name("100k unshift & shift");

// Test 4: 100k addAt(mid): index-like insertion (re-locate mid iterator for each insert)
static void AddAtMid1M(benchmark::State& state) {
  for (auto _ : state) {
    std::list<int> list;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      list.push_back(i);
    }

    for (int i = 0; i < HUNDRED_THOUSAND / 10; i++) {
      auto it = list.begin();
      std::advance(it, HUNDRED_THOUSAND / 2);
      list.insert(it, i);
    }

    benchmark::DoNotOptimize(list);
  }
}
// Keep iterations low: this workload is intentionally heavy (O(n * inserts)).
BENCHMARK(AddAtMid1M)->Name("100k addAt(mid)")->Iterations(1);

// Test 5: 100k addBefore (cursor): insert before a fixed cursor (iterator)
static void AddBeforeCursor1M(benchmark::State& state) {
  for (auto _ : state) {
    std::list<int> list;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      list.push_back(i);
    }

    auto cursor = list.begin();
    std::advance(cursor, HUNDRED_THOUSAND / 2);

    for (int i = 0; i < HUNDRED_THOUSAND / 10; i++) {
      list.insert(cursor, i);
    }
    benchmark::DoNotOptimize(list);
  }
}
BENCHMARK(AddBeforeCursor1M)->Name("100k addBefore (cursor)");

BENCHMARK_MAIN();

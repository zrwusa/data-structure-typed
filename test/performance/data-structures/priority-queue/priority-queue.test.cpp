#include <benchmark/benchmark.h>
#include <queue>
#include <vector>

const int HUNDRED_THOUSAND = 100000;

std::string formatNumber(int num) {
  std::string result = std::to_string(num);
  int n = result.length() - 3;
  while (n > 0) {
    result.insert(n, ",");
    n -= 3;
  }
  return result;
}

// Test 1: 100K add
static void Add100K(benchmark::State& state) {
  for (auto _ : state) {
    // Max-heap by default (greater values have higher priority)
    std::priority_queue<int> pq;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      pq.push(i);
    }
    benchmark::DoNotOptimize(pq);
  }
}
BENCHMARK(Add100K)->Name(formatNumber(HUNDRED_THOUSAND) + " add");

// Test 2: 100K add & poll
static void AddAndPoll100K(benchmark::State& state) {
  for (auto _ : state) {
    // Max-heap by default
    std::priority_queue<int> pq;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      pq.push(i);
    }
    while (!pq.empty()) {
      pq.pop();
    }
    benchmark::DoNotOptimize(pq);
  }
}
BENCHMARK(AddAndPoll100K)->Name(formatNumber(HUNDRED_THOUSAND) + " add & poll");

// Test 3: Min-heap for comparison
static void MinHeapAdd100K(benchmark::State& state) {
  for (auto _ : state) {
    // Min-heap using greater comparator
    std::priority_queue<int, std::vector<int>, std::greater<int>> pq;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      pq.push(i);
    }
    benchmark::DoNotOptimize(pq);
  }
}
BENCHMARK(MinHeapAdd100K)->Name(formatNumber(HUNDRED_THOUSAND) + " add (min-heap)");

BENCHMARK_MAIN();

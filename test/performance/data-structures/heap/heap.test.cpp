#include <benchmark/benchmark.h>
#include <queue>
#include <random>
#include <vector>

const int HUNDRED_THOUSAND = 100000;

// Global random number generator
std::mt19937 gen(std::random_device{}());
std::uniform_int_distribution<> dis(0, HUNDRED_THOUSAND - 1);

// Generate random array
std::vector<int> generateRandomArray(int size) {
  std::vector<int> arr;
  arr.reserve(size);
  for (int i = 0; i < size; i++) {
    arr.push_back(dis(gen));
  }
  return arr;
}

static const auto indicesHT = generateRandomArray(HUNDRED_THOUSAND);

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
    std::priority_queue<int, std::vector<int>, std::greater<int>> heap;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      heap.push(indicesHT[i]);
    }
    benchmark::DoNotOptimize(heap);
  }
}
BENCHMARK(Add100K)->Name(formatNumber(HUNDRED_THOUSAND) + " add");

// Test 2: 100K add & poll
static void AddAndPoll100K(benchmark::State& state) {
  for (auto _ : state) {
    std::priority_queue<int, std::vector<int>, std::greater<int>> heap;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      heap.push(indicesHT[i]);
    }
    while (!heap.empty()) {
      heap.pop();
    }
    benchmark::DoNotOptimize(heap);
  }
}
BENCHMARK(AddAndPoll100K)->Name(formatNumber(HUNDRED_THOUSAND) + " add & poll");

BENCHMARK_MAIN();

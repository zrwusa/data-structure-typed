#include <benchmark/benchmark.h>
#include <queue>

const int MILLION = 1000000;
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

// Test 1: 1M push
static void Push1M(benchmark::State& state) {
  for (auto _ : state) {
    std::queue<int> queue;
    for (int i = 0; i < MILLION; i++) {
      queue.push(i);
    }
    benchmark::DoNotOptimize(queue);
  }
}
BENCHMARK(Push1M)->Name(formatNumber(MILLION) + " push");

// Test 2: 100K push & shift (FIFO - Queue behavior)
static void PushAndShift100K(benchmark::State& state) {
  for (auto _ : state) {
    std::queue<int> queue;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      queue.push(i);
    }
    while (!queue.empty()) {
      queue.pop();
    }
    benchmark::DoNotOptimize(queue);
  }
}
BENCHMARK(PushAndShift100K)->Name(formatNumber(HUNDRED_THOUSAND) + " push & shift");

// Test 3: Native std::deque 100K push & shift (for comparison)
static void DequeNativePushAndShift100K(benchmark::State& state) {
  for (auto _ : state) {
    std::deque<int> deque;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      deque.push_back(i);
    }
    while (!deque.empty()) {
      deque.pop_front();
    }
    benchmark::DoNotOptimize(deque);
  }
}
BENCHMARK(DequeNativePushAndShift100K)->Name("Native std::deque " + formatNumber(HUNDRED_THOUSAND) + " push & shift");

BENCHMARK_MAIN();

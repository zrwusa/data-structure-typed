#include <benchmark/benchmark.h>
#include <deque>

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
    std::deque<int> deque;
    for (int i = 0; i < MILLION; i++) {
      deque.push_back(i);
    }
    benchmark::DoNotOptimize(deque);
  }
}
BENCHMARK(Push1M)->Name("1M push");

// Test 2: 1M push & pop (LIFO - Stack behavior)
static void PushAndPop1M(benchmark::State& state) {
  for (auto _ : state) {
    std::deque<int> deque;
    for (int i = 0; i < MILLION; i++) {
      deque.push_back(i);
    }
    while (!deque.empty()) {
      deque.pop_back();
    }
    benchmark::DoNotOptimize(deque);
  }
}
BENCHMARK(PushAndPop1M)->Name("1M push & pop");

// Test 3: 1M push & shift (FIFO - Queue behavior)
static void PushAndShift1M(benchmark::State& state) {
  for (auto _ : state) {
    std::deque<int> deque;
    for (int i = 0; i < MILLION; i++) {
      deque.push_back(i);
    }
    while (!deque.empty()) {
      deque.pop_front();
    }
    benchmark::DoNotOptimize(deque);
  }
}
BENCHMARK(PushAndShift1M)->Name("1M push & shift");

// Test 4: 100K push & shift
static void PushAndShift100K(benchmark::State& state) {
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
BENCHMARK(PushAndShift100K)->Name("100K push & shift");

// Test 5: Native vector 100K push & shift (for comparison)
static void VectorPushAndShift100K(benchmark::State& state) {
  for (auto _ : state) {
    std::vector<int> arr;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      arr.push_back(i);
    }
    while (!arr.empty()) {
      arr.erase(arr.begin());
    }
    benchmark::DoNotOptimize(arr);
  }
}
BENCHMARK(VectorPushAndShift100K)->Name("Native vector 100K push & shift");

// Test 6: 100K unshift & shift (add to front)
static void UnshiftAndShift100K(benchmark::State& state) {
  for (auto _ : state) {
    std::deque<int> deque;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      deque.push_front(i);
    }
    while (!deque.empty()) {
      deque.pop_front();
    }
    benchmark::DoNotOptimize(deque);
  }
}
BENCHMARK(UnshiftAndShift100K)->Name("100K unshift & shift");

// Test 7: Native vector 100K unshift & shift (for comparison)
static void VectorUnshiftAndShift100K(benchmark::State& state) {
  for (auto _ : state) {
    std::vector<int> arr;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      arr.insert(arr.begin(), i);
    }
    while (!arr.empty()) {
      arr.erase(arr.begin());
    }
    benchmark::DoNotOptimize(arr);
  }
}
BENCHMARK(VectorUnshiftAndShift100K)->Name("Native vector 100K unshift & shift");

BENCHMARK_MAIN();

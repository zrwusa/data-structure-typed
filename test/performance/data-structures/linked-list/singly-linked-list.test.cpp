#include <benchmark/benchmark.h>
#include <forward_list>

const int HUNDRED_THOUSAND = 100000;
const int TEN_THOUSAND = 10000;

// Head operations (push_front/pop_front) - O(1) for std::forward_list
// Fair comparison with JS SinglyLinkedList unshift/shift

static void UnshiftAndShift100K(benchmark::State& state) {
  for (auto _ : state) {
    std::forward_list<int> list;
    for (int i = 0; i < HUNDRED_THOUSAND; i++) {
      list.push_front(i);
    }
    while (!list.empty()) {
      list.pop_front();
    }
    benchmark::DoNotOptimize(list);
  }
}
BENCHMARK(UnshiftAndShift100K)->Name("100K unshift & shift")->Unit(benchmark::kMillisecond);

static void UnshiftAndShift10K(benchmark::State& state) {
  for (auto _ : state) {
    std::forward_list<int> list;
    for (int i = 0; i < TEN_THOUSAND; i++) {
      list.push_front(i);
    }
    while (!list.empty()) {
      list.pop_front();
    }
    benchmark::DoNotOptimize(list);
  }
}
BENCHMARK(UnshiftAndShift10K)->Name("10K unshift & shift")->Unit(benchmark::kMillisecond);

// Index-based insertion: advance to middle for each insert (O(n) per insert)
static void AddAtMid10K(benchmark::State& state) {
  for (auto _ : state) {
    std::forward_list<int> list;
    for (int i = 0; i < TEN_THOUSAND; i++) {
      list.push_front(i);
    }

    for (int i = 0; i < TEN_THOUSAND / 10; i++) {
      auto it = list.begin();
      std::advance(it, TEN_THOUSAND / 2);
      list.insert_after(it, i);
    }

    benchmark::DoNotOptimize(list);
  }
}
BENCHMARK(AddAtMid10K)->Name("10K addAt(mid)")->Iterations(1)->Unit(benchmark::kMillisecond);

// Cursor-based insertion: insert at a fixed iterator (O(1) per insert)
static void AddBeforeCursor10K(benchmark::State& state) {
  for (auto _ : state) {
    std::forward_list<int> list;
    for (int i = 0; i < TEN_THOUSAND; i++) {
      list.push_front(i);
    }

    auto cursor = list.begin();
    std::advance(cursor, TEN_THOUSAND / 2);

    for (int i = 0; i < TEN_THOUSAND / 10; i++) {
      list.insert_after(cursor, i);
    }

    benchmark::DoNotOptimize(list);
  }
}
BENCHMARK(AddBeforeCursor10K)->Name("10K addBefore (cursor)")->Unit(benchmark::kMillisecond);

BENCHMARK_MAIN();

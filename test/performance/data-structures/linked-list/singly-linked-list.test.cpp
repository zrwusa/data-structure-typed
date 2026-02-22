#include <benchmark/benchmark.h>
#include <forward_list>
#include <list>

const int HUNDRED_THOUSAND = 100000;
const int TEN_THOUSAND = 10000;

// Test 1: 100k push_front & pop_front (head operations - O(1) each)
// Note: JS SinglyLinkedList "push & shift" pushes to back, shifts from front
// std::forward_list only has efficient front operations
static void PushFrontPopFront100K(benchmark::State& state) {
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
BENCHMARK(PushFrontPopFront100K)->Name("100K push_front & pop_front (head ops)")->Unit(benchmark::kMillisecond);

// Test 2: 10K push_back & pop_back using std::list (fair comparison to JS push/pop)
// std::list has O(1) push_back and pop_back
static void PushBackPopBack10K(benchmark::State& state) {
  for (auto _ : state) {
    std::list<int> list;
    for (int i = 0; i < TEN_THOUSAND; i++) {
      list.push_back(i);
    }
    while (!list.empty()) {
      list.pop_back();
    }
    benchmark::DoNotOptimize(list);
  }
}
BENCHMARK(PushBackPopBack10K)->Name("10K push & pop (std::list)")->Unit(benchmark::kMillisecond);

// Test 3: 10K addAt(mid): index-like insertion
// Re-locate to the middle (advance from begin) for each insert.
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

// Test 4: 10K addBefore (cursor): insert at a fixed cursor (iterator)
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

/**
 * Stack Benchmark Suite
 * Measures performance of stack operations (LIFO)
 * Compiled to benchmark executable by CMake
 */

#include <benchmark/benchmark.h>
#include <stack>

const int MILLION = 1'000'000;

// Test 1: 1M push
static void Push_1M(benchmark::State& state) {
  for (auto _ : state) {
    std::stack<int> stack;
    for (int i = 0; i < MILLION; ++i) {
      stack.push(i);
    }
    benchmark::DoNotOptimize(stack);
  }
}
BENCHMARK(Push_1M)->Name("1M push");

// Test 2: 1M push & pop
static void Push_Pop_1M(benchmark::State& state) {
  for (auto _ : state) {
    std::stack<int> stack;
    for (int i = 0; i < MILLION; ++i) {
      stack.push(i);
    }
    for (int i = 0; i < MILLION; ++i) {
      stack.pop();
    }
    benchmark::DoNotOptimize(stack);
  }
}
BENCHMARK(Push_Pop_1M)->Name("1M push & pop");

// Benchmark entry point
BENCHMARK_MAIN();
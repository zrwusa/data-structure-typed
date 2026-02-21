#include <benchmark/benchmark.h>
#include <unordered_map>
#include <unordered_set>

const int MILLION = 1000000;

std::string formatNumber(int num) {
  std::string result = std::to_string(num);
  int n = result.length() - 3;
  while (n > 0) {
    result.insert(n, ",");
    n -= 3;
  }
  return result;
}

// Test 1: 1M set
static void Set1M(benchmark::State& state) {
  for (auto _ : state) {
    std::unordered_map<int, int> hm;
    for (int i = 0; i < MILLION; i++) {
      hm[i] = i;
    }
    benchmark::DoNotOptimize(hm);
  }
}
BENCHMARK(Set1M)->Name("1M set");

// Test 2: Native std::map 1M set (for comparison)
static void StdMapSet1M(benchmark::State& state) {
  for (auto _ : state) {
    std::map<int, int> hm;
    for (int i = 0; i < MILLION; i++) {
      hm[i] = i;
    }
    benchmark::DoNotOptimize(hm);
  }
}
BENCHMARK(StdMapSet1M)->Name("std::map 1M set");

// Test 3: std::unordered_set 1M add
static void UnorderedSetAdd1M(benchmark::State& state) {
  for (auto _ : state) {
    std::unordered_set<int> hs;
    for (int i = 0; i < MILLION; i++) {
      hs.insert(i);
    }
    benchmark::DoNotOptimize(hs);
  }
}
BENCHMARK(UnorderedSetAdd1M)->Name("std::unordered_set 1M add");

// Test 4: 1M set & get
static void SetAndGet1M(benchmark::State& state) {
  for (auto _ : state) {
    std::unordered_map<int, int> hm;
    for (int i = 0; i < MILLION; i++) {
      hm[i] = i;
    }
    int count = 0;
    for (int i = 0; i < MILLION; i++) {
      if (hm.find(i) != hm.end()) {
        count++;
      }
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(SetAndGet1M)->Name("1M set & get");

// Test 5: std::map 1M set & get
static void StdMapSetAndGet1M(benchmark::State& state) {
  for (auto _ : state) {
    std::map<int, int> hm;
    for (int i = 0; i < MILLION; i++) {
      hm[i] = i;
    }
    int count = 0;
    for (int i = 0; i < MILLION; i++) {
      if (hm.find(i) != hm.end()) {
        count++;
      }
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(StdMapSetAndGet1M)->Name("std::map 1M set & get");

// Test 6: std::unordered_set 1M add & has
static void UnorderedSetAddAndHas1M(benchmark::State& state) {
  for (auto _ : state) {
    std::unordered_set<int> hs;
    for (int i = 0; i < MILLION; i++) {
      hs.insert(i);
    }
    int count = 0;
    for (int i = 0; i < MILLION; i++) {
      if (hs.find(i) != hs.end()) {
        count++;
      }
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(UnorderedSetAddAndHas1M)->Name("std::unordered_set 1M add & has");

// Test 7: 1M ObjKey set & get
static void ObjKeySetAndGet1M(benchmark::State& state) {
  for (auto _ : state) {
    struct Obj { int key; int value; };
    struct ObjHash { size_t operator()(const Obj& o) const { return std::hash<int>()(o.key); } };
    struct ObjEqual { bool operator()(const Obj& a, const Obj& b) const { return a.key == b.key; } };
    
    std::unordered_map<Obj, int, ObjHash, ObjEqual> hm;
    std::vector<Obj> objKeys;
    for (int i = 0; i < MILLION; i++) {
      Obj obj = {i, i};
      objKeys.push_back(obj);
      hm[obj] = i;
    }
    
    int count = 0;
    for (int i = 0; i < MILLION; i++) {
      if (hm.find(objKeys[i]) != hm.end()) {
        count++;
      }
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(ObjKeySetAndGet1M)->Name("1M ObjKey set & get");

// Test 8: std::map 1M ObjKey set & get
static void StdMapObjKeySetAndGet1M(benchmark::State& state) {
  for (auto _ : state) {
    struct Obj { int key; int value; bool operator<(const Obj& other) const { return key < other.key; } };
    
    std::map<Obj, int> hm;
    std::vector<Obj> objs;
    for (int i = 0; i < MILLION; i++) {
      Obj obj = {i, i};
      objs.push_back(obj);
      hm[obj] = i;
    }
    
    int count = 0;
    for (int i = 0; i < MILLION; i++) {
      if (hm.find(objs[i]) != hm.end()) {
        count++;
      }
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(StdMapObjKeySetAndGet1M)->Name("std::map 1M ObjKey set & get");

// Test 9: std::unordered_set 1M ObjKey add & has
static void UnorderedSetObjKeyAddAndHas1M(benchmark::State& state) {
  for (auto _ : state) {
    struct Obj { int key; int value; };
    struct ObjHash { size_t operator()(const Obj& o) const { return std::hash<int>()(o.key); } };
    struct ObjEqual { bool operator()(const Obj& a, const Obj& b) const { return a.key == b.key; } };
    
    std::unordered_set<Obj, ObjHash, ObjEqual> hs;
    std::vector<Obj> objs;
    for (int i = 0; i < MILLION; i++) {
      Obj obj = {i, i};
      objs.push_back(obj);
      hs.insert(obj);
    }
    
    int count = 0;
    for (int i = 0; i < MILLION; i++) {
      if (hs.find(objs[i]) != hs.end()) {
        count++;
      }
    }
    benchmark::DoNotOptimize(count);
  }
}
BENCHMARK(UnorderedSetObjKeyAddAndHas1M)->Name("std::unordered_set 1M ObjKey add & has");

BENCHMARK_MAIN();

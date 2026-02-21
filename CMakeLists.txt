cmake_minimum_required(VERSION 3.20)
project(data-structure-benchmarks CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Release mode optimizations
if(NOT CMAKE_BUILD_TYPE)
  set(CMAKE_BUILD_TYPE Release)
endif()

set(CMAKE_CXX_FLAGS_RELEASE "-O3 -march=native")

# Set policy explicitly
cmake_policy(SET CMP0135 NEW)

# Google Benchmark
include(FetchContent)

FetchContent_Declare(
  benchmark
  GIT_REPOSITORY https://github.com/google/benchmark.git
  GIT_TAG v1.8.3
)

set(BENCHMARK_ENABLE_TESTING OFF CACHE BOOL "Disable benchmark testing" FORCE)
set(BENCHMARK_ENABLE_INSTALL OFF CACHE BOOL "Disable benchmark install" FORCE)

FetchContent_MakeAvailable(benchmark)

# Find all C++ test files
file(GLOB_RECURSE CPP_TEST_FILES "${CMAKE_SOURCE_DIR}/test/performance/data-structures/**/*.test.cpp")

message(STATUS "Found C++ test files: ${CPP_TEST_FILES}")

# Create executable for each test file
foreach(TEST_FILE ${CPP_TEST_FILES})
  get_filename_component(TEST_NAME ${TEST_FILE} NAME_WE)
  string(REGEX REPLACE "\\.test$" "" TARGET_NAME ${TEST_NAME})

  message(STATUS "Creating benchmark target: ${TARGET_NAME}-benchmark")

  add_executable(${TARGET_NAME}-benchmark ${TEST_FILE})
  target_link_libraries(${TARGET_NAME}-benchmark PRIVATE benchmark::benchmark)

  set_target_properties(${TARGET_NAME}-benchmark PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
    CXX_STANDARD 17
    CXX_STANDARD_REQUIRED ON
  )
endforeach()
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.logBigOMetrics = exports.logBigOMetricsWrap = exports.bigO = exports.magnitude = void 0;
var config_1 = require('../config');

var isDebug = config_1.isDebugTest;
var orderReducedBy = 2; // reduction of bigO's order compared to the baseline bigO
exports.magnitude = {
  CONSTANT: Math.floor(Number.MAX_SAFE_INTEGER / Math.pow(10, orderReducedBy)),
  LOG_N: Math.pow(10, 9 - orderReducedBy),
  LINEAR: Math.pow(10, 6 - orderReducedBy),
  N_LOG_N: Math.pow(10, 5 - orderReducedBy),
  SQUARED: Math.pow(10, 4 - orderReducedBy),
  CUBED: Math.pow(10, 3 - orderReducedBy),
  FACTORIAL: 20 - orderReducedBy
};
exports.bigO = {
  CONSTANT: exports.magnitude.CONSTANT / 100000,
  LOG_N: Math.log2(exports.magnitude.LOG_N) / 1000,
  LINEAR: exports.magnitude.LINEAR / 1000,
  N_LOG_N: (exports.magnitude.N_LOG_N * Math.log2(exports.magnitude.LOG_N)) / 1000,
  SQUARED: Math.pow(exports.magnitude.SQUARED, 2) / 1000,
  CUBED: Math.pow(exports.magnitude.SQUARED, 3) / 1000,
  FACTORIAL: 10000
};
function findPotentialN(input) {
  var longestArray = [];
  var mostProperties = {};
  function recurse(obj) {
    if (Array.isArray(obj)) {
      if (obj.length > longestArray.length) {
        longestArray = obj;
      }
    } else if (typeof obj === 'object' && obj !== null) {
      var keys = Object.keys(obj);
      if (keys.length > Object.keys(mostProperties).length) {
        mostProperties = obj;
      }
      keys.forEach(function (key) {
        recurse(obj[key]);
      });
    }
  }
  if (Array.isArray(input)) {
    input.forEach(function (item) {
      recurse(item);
    });
  } else {
    recurse(input);
  }
  // return [longestArray, mostProperties] : [any[], { [key: string]: any }];
  return Math.max(longestArray.length, Object.keys(mostProperties).length);
}
function linearRegression(x, y) {
  var n = x.length;
  var sumX = x.reduce(function (acc, val) {
    return acc + val;
  }, 0);
  var sumY = y.reduce(function (acc, val) {
    return acc + val;
  }, 0);
  var sumXSquared = x.reduce(function (acc, val) {
    return acc + Math.pow(val, 2);
  }, 0);
  var sumXY = x.reduce(function (acc, val, i) {
    return acc + val * y[i];
  }, 0);
  var slope = (n * sumXY - sumX * sumY) / (n * sumXSquared - Math.pow(sumX, 2));
  var intercept = (sumY - slope * sumX) / n;
  var yHat = x.map(function (val) {
    return slope * val + intercept;
  });
  var totalVariation = y
    .map(function (val, i) {
      return Math.pow(val - yHat[i], 2);
    })
    .reduce(function (acc, val) {
      return acc + val;
    }, 0);
  var explainedVariation = y
    .map(function (val) {
      return Math.pow(val - sumY / n, 2);
    })
    .reduce(function (acc, val) {
      return acc + val;
    }, 0);
  var rSquared = 1 - totalVariation / explainedVariation;
  return {slope: slope, intercept: intercept, rSquared: rSquared};
}
function estimateBigO(runtimes, dataSizes) {
  // Make sure the input runtimes and data sizes have the same length
  if (runtimes.length !== dataSizes.length) {
    return 'Lengths of input arrays do not match';
  }
  // Create an array to store the computational complexity of each data point
  var complexities = [];
  // Traverse different possible complexities
  var complexitiesToCheck = [
    'O(1)',
    'O(log n)',
    'O(n)',
    'O(n log n)',
    'O(n^2)' // squared time complexity
  ];
  var _loop_1 = function (complexity) {
    // Calculate data points for fitting
    var fittedData = dataSizes.map(function (size) {
      if (complexity === 'O(1)') {
        return 1; // constant time complexity
      } else if (complexity === 'O(log n)') {
        return Math.log(size);
      } else if (complexity === 'O(n)') {
        return size;
      } else if (complexity === 'O(n log n)') {
        return size * Math.log(size);
      } else if (complexity === 'O(n^2)') {
        return Math.pow(size, 2);
      } else {
        return Math.pow(size, 10);
      }
    });
    // Fit the data points using linear regression analysis
    var regressionResult = linearRegression(fittedData, runtimes);
    // Check the R-squared value of the fit. It is usually considered a valid fit if it is greater than 0.9.
    if (regressionResult.rSquared >= 0.9) {
      complexities.push(complexity);
    }
  };
  for (var _i = 0, complexitiesToCheck_1 = complexitiesToCheck; _i < complexitiesToCheck_1.length; _i++) {
    var complexity = complexitiesToCheck_1[_i];
    _loop_1(complexity);
  }
  // If there is no valid fitting result, return "cannot estimate", otherwise return the estimated time complexity
  if (complexities.length === 0) {
    return 'Unable to estimate';
  } else {
    return complexities.join(' or ');
  }
}
var methodLogs = new Map();
function logBigOMetricsWrap(fn, args, fnName) {
  var startTime = performance.now();
  var result = fn(args);
  var endTime = performance.now();
  var runTime = endTime - startTime;
  var methodName = ''.concat(fnName);
  if (!methodLogs.has(methodName)) {
    methodLogs.set(methodName, []);
  }
  var methodLog = methodLogs.get(methodName);
  var maxDataSize = args.length === 1 && typeof args[0] === 'number' ? args[0] : findPotentialN(args);
  if (methodLog) {
    methodLog.push([runTime, maxDataSize]);
    if (methodLog.length >= 20) {
      isDebug && console.log('triggered', methodName, methodLog);
      var bigO_1 = estimateBigO(
        methodLog.map(function (_a) {
          var runTime = _a[0];
          return runTime;
        }),
        methodLog.map(function (_a) {
          var runTime = _a[0];
          return runTime;
        })
      );
      isDebug && console.log('Estimated Big O: '.concat(bigO_1));
      methodLogs.delete(methodName);
    }
  }
  return result;
}
exports.logBigOMetricsWrap = logBigOMetricsWrap;
function logBigOMetrics(target, propertyKey, descriptor) {
  var originalMethod = descriptor.value;
  descriptor.value = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var startTime = performance.now();
    var result = originalMethod.apply(this, args);
    var endTime = performance.now();
    var runTime = endTime - startTime;
    var methodName = ''.concat(target.constructor.name, '.').concat(propertyKey);
    if (!methodLogs.has(methodName)) {
      methodLogs.set(methodName, []);
    }
    var methodLog = methodLogs.get(methodName);
    var maxDataSize = args.length === 1 && typeof args[0] === 'number' ? args[0] : findPotentialN(args);
    if (methodLog) {
      methodLog.push([runTime, maxDataSize]);
      if (methodLog.length >= 20) {
        isDebug && console.log('triggered', methodName, methodLog);
        var bigO_2 = estimateBigO(
          methodLog.map(function (_a) {
            var runTime = _a[0];
            return runTime;
          }),
          methodLog.map(function (_a) {
            var runTime = _a[0];
            return runTime;
          })
        );
        isDebug && console.log('Estimated Big O: '.concat(bigO_2));
        methodLogs.delete(methodName);
      }
    }
    return result;
  };
  return descriptor;
}
exports.logBigOMetrics = logBigOMetrics;

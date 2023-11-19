PACKAGE_VERSION=$(jq -r '.version' package.json)
echo checking data-structure-typed@$PACKAGE_VERSION
npm view data-structure-typed@$PACKAGE_VERSION

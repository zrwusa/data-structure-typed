#PACKAGE_VERSION=$(jq -r '.version' package.json)
#echo checking data-structure-typed@$PACKAGE_VERSION
#npm view data-structure-typed@$PACKAGE_VERSION


# Retrieve version from package.json
PACKAGE_VERSION=$(jq -r '.version' package.json)
echo "Checking data-structure-typed@$PACKAGE_VERSION"

# Set the interval as 5 seconds
POLL_INTERVAL=5
# Set the timeout as 120 seconds
TIMEOUT=120

# Record the start time
START_TIME=$(date +%s)

# Run the loop
while true; do
    # Retrieve the version of npm package remotely
    REMOTE_VERSION=$(npm view data-structure-typed@$PACKAGE_VERSION version)

    # Compare the remote version with local version
    if [ "$REMOTE_VERSION" == "$PACKAGE_VERSION" ]; then
        echo "Version match found: $REMOTE_VERSION"
        break
    fi

    # Check timeout
    CURRENT_TIME=$(date +%s)
    ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
    if [ "$ELAPSED_TIME" -ge "$TIMEOUT" ]; then
        echo "Timeout reached. Version $PACKAGE_VERSION not found in the registry."
        break
    fi

    # Wait for the next round
    sleep $POLL_INTERVAL
done

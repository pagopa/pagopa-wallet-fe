#!/bin/bash

# Print relevant environment variables
env | grep -i WALLET_CONFIG_

# Recreate config file and assignment
echo "window._env_ = {" > ./src/env-config.js

# Loop on environment variables prefixed with
# checkout_var and add them to env-config.js
for wallet_config_var in $(env | grep WALLET_CONFIG_); do
    varname=$(printf '%s\n' "$wallet_config_var" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$wallet_config_var" | sed -e 's/^[^=]*=//')

    echo "  $varname: \"$varvalue\"," >> ./src/env-config.js
done

echo "}" >> ./src/env-config.js

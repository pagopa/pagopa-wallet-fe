#!/usr/bin/env bash

# Recreate config file and assignment
echo "window._env_ = {" > ./src/env-config.js

# Loop on environment variables prefixed with
# checkout_var and add them to env-config.js
for checkout_var in $(env | grep -Ei '(checkout_|wallet_)'); do
    varname=$(printf '%s\n' "$checkout_var" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$checkout_var" | sed -e 's/^[^=]*=//')

    echo "  $varname: \"$varvalue\"," >> ./src/env-config.js
done

echo "}" >> ./src/env-config.js
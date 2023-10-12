#!/usr/bin/env bash

# Recreate the .env file used by parcel when building
# Loop on environment variables prefixed with _API and add them to .env
for wallet_fe_var in $(env | grep -i API_); do
    varname=$(printf '%s\n' "$wallet_fe_var" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$wallet_fe_var" | sed -e 's/^[^=]*=//')

    echo $varname=$varvalue >> .env
done

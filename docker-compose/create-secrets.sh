#!/bin/bash

# Function to extract value from _FILE suffix variables
extract_secret_value() {
    local var_name=$1
    local var_value=$2
    
    # Remove _FILE suffix for secret name
    secret_name=$(echo "$var_name" | sed 's/_FILE$//')
    secret_name=$(echo "$secret_name" | tr '[:upper:]' '[:lower:]')

    # Create Docker secret
    echo "Creating secret: $secret_name"
    echo "$var_value" | docker secret create "$secret_name" -
}

# Read .env file line by line
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    if [[ -z "$key" ]] || [[ "$key" =~ ^# ]]; then
        continue
    fi

    # Clean up key and value
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)

    # Process only *_FILE variables that have values
    if [[ "$key" == *"_FILE"* ]] && [[ ! -z "$value" ]]; then
        # Remove any surrounding quotes from value
        value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
        extract_secret_value "$key" "$value"
    fi
done < .env

echo "Docker secrets creation completed!"
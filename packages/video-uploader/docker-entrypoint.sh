#!/bin/bash
set -e

# Print environment variables for debugging (optional)
# env

# Execute the command passed to docker run
exec "$@"
#!/bin/bash

# Update all hardcoded localhost URLs to use environment variables

echo "Updating hardcoded API URLs..."

# Find all TypeScript/TSX files with localhost:8000 or localhost:8001
files=$(find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "localhost:800[01]" {} \;)

for file in $files; do
  echo "Updating $file"
  
  # Skip api-client.ts and use-websocket.ts as they're already updated
  if [[ "$file" == *"api-client.ts"* ]] || [[ "$file" == *"use-websocket.ts"* ]] || [[ "$file" == *"api-urls.ts"* ]]; then
    continue
  fi
  
  # Replace http://localhost:8000 with ${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}
  sed -i '' "s|'http://localhost:8000|'process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000|g" "$file"
  sed -i '' 's|"http://localhost:8000|"process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000|g' "$file"
  sed -i '' 's|`http://localhost:8000|`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}|g' "$file"
  
  # Replace http://localhost:8001 with ${process.env.NEXT_PUBLIC_FRAUD_API_URL || 'http://localhost:8001'}
  sed -i '' "s|'http://localhost:8001|'process.env.NEXT_PUBLIC_FRAUD_API_URL || 'http://localhost:8001|g" "$file"
  sed -i '' 's|"http://localhost:8001|"process.env.NEXT_PUBLIC_FRAUD_API_URL || "http://localhost:8001|g' "$file"
  sed -i '' 's|`http://localhost:8001|`${process.env.NEXT_PUBLIC_FRAUD_API_URL || "http://localhost:8001"}|g' "$file"
done

echo "Done updating API URLs!"
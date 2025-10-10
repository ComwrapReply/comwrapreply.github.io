#!/bin/bash

# Cleanup script to kill processes on common development ports
# This prevents port conflicts when starting new projects

echo "🧹 Cleaning up development ports..."

# Common development ports
PORTS=(3000 3001 5000 8080 8000 4000 9000)

for port in "${PORTS[@]}"; do
    # Find processes using the port
    pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ ! -z "$pids" ]; then
        echo "🔍 Found processes on port $port: $pids"
        
        # Check if it's a Node.js process
        for pid in $pids; do
            if ps -p $pid -o comm= | grep -q "node"; then
                echo "⚠️  Killing Node.js process $pid on port $port"
                kill $pid
            else
                echo "ℹ️  Process $pid on port $port is not Node.js, skipping"
            fi
        done
    else
        echo "✅ Port $port is free"
    fi
done

echo "🎉 Port cleanup complete!"
echo ""
echo "💡 To prevent this in the future:"
echo "   - Always use Ctrl+C to stop development servers"
echo "   - Check for running processes: lsof -ti:3000,5000,8080"
echo "   - Kill specific processes: kill <PID>"


#!/bin/bash
set -e

echo ">>> Starting MongoDB entrypoint script..."

# Start MongoDB without auth so we can initialize the replica set
mongod --replSet rs0 --bind_ip_all --dbpath /data/db --port 27017 &
pid="$!"

# Wait for MongoDB startup
echo ">>> Waiting for MongoDB to start..."
until mongo --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  sleep 2
done

echo ">>> MongoDB started. Initializing replica set..."

mongo <<EOF
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongodb:27017" }
  ]
})
EOF

# Wait for the replica set to become PRIMARY
echo ">>> Waiting for PRIMARY status..."
until mongo --quiet --eval "rs.isMaster().ismaster" | grep "true" > /dev/null 2>&1; do
  sleep 2
done

echo ">>> Creating admin user..."

mongo <<EOF
use admin
db.createUser({
  user: "$MONGO_INITDB_ROOT_USERNAME",
  pwd: "$MONGO_INITDB_ROOT_PASSWORD",
  roles: [ { role: "root", db: "admin" } ]
})
EOF

echo ">>> Admin user created."

# Stop the temporary Mongo process
echo ">>> Shutting down temporary MongoDB..."
mongod --shutdown

# Restart MongoDB with AUTH enabled
echo ">>> Restarting MongoDB with authentication..."
exec mongod --auth --replSet rs0 --bind_ip_all --dbpath /data/db --port 27017

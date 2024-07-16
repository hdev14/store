# Redis for integration tests
docker run --name test_redis -p 6379:6379 -d redis

# Postgres for integration tests
docker run --name test_postgres -p 5432:5432 -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=admin -d postgres

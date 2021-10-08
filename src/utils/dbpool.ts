import { Knex, knex } from 'knex';

// [START cloud_sql_postgres_knex_create_tcp]
const createTcpPool = async (name: string, config: Knex.Config) => {
  // Extract host and port from socket address
  const dbSocketAddr = process.env.DB_HOST1?.split(':'); // e.g. '127.0.0.1:5432'

  console.log('dbSocketAddr: ', dbSocketAddr);
  console.log('name: ', name);

  // Establish a connection to the database
  return knex({
    client: 'pg',
    connection: {
      user: process.env.DB_USER, // e.g. 'my-user'
      password: process.env.DB_PASS, // e.g. 'my-user-password'
      database: name, // e.g. 'my-database'
      host: dbSocketAddr![0], // e.g. '127.0.0.1'
      port: +dbSocketAddr![1], // e.g. '5432'
    },
    // ... Specify additional properties here.
    ...config,
  });
};
// [END cloud_sql_postgres_knex_create_tcp]

// [START cloud_sql_postgres_knex_create_socket]
const createUnixSocketPool = async (
  name: string,
  CLOUD_SQL_CONNECTION_NAME: string,
  config: Knex.Config,
) => {
  const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';

  console.log('dbSocketPath: ', dbSocketPath);

  // Establish a connection to the database
  return knex({
    client: 'pg',
    connection: {
      user: process.env.DB_USER, // e.g. 'my-user'
      password: process.env.DB_PASS, // e.g. 'my-user-password'
      database: name, // e.g. 'my-database'
      host: `${dbSocketPath}/${CLOUD_SQL_CONNECTION_NAME}`,
    },
    // ... Specify additional properties here.
    ...config,
  });
};
// [END cloud_sql_postgres_knex_create_socket]

// Initialize Knex, a Node.js SQL query builder library with built-in connection pooling.
export const createPool = async (dbOrder: string) => {
  // Configure which instance and what database user to connect with.
  // Remember - storing secrets in plaintext is potentially unsafe. Consider using
  // something like https://cloud.google.com/kms/ to help keep secrets secret.
  const config: any = { pool: {} };

  // [START cloud_sql_postgres_knex_limit]
  // 'max' limits the total number of concurrent connections this pool will keep. Ideal
  // values for this setting are highly variable on app design, infrastructure, and database.
  config.pool.max = 5;
  // 'min' is the minimum number of idle connections Knex maintains in the pool.
  // Additional connections will be established to meet this value unless the pool is full.
  config.pool.min = 5;
  // [END cloud_sql_postgres_knex_limit]

  // [START cloud_sql_postgres_knex_timeout]
  // 'acquireTimeoutMillis' is the number of milliseconds before a timeout occurs when acquiring a
  // connection from the pool. This is slightly different from connectionTimeout, because acquiring
  // a pool connection does not always involve making a new connection, and may include multiple retries.
  // when making a connection
  config.pool.acquireTimeoutMillis = 60000; // 60 seconds
  // 'createTimeoutMillis` is the maximum number of milliseconds to wait trying to establish an
  // initial connection before retrying.
  // After acquireTimeoutMillis has passed, a timeout exception will be thrown.
  config.pool.createTimeoutMillis = 30000; // 30 seconds
  // 'idleTimeoutMillis' is the number of milliseconds a connection must sit idle in the pool
  // and not be checked out before it is automatically closed.
  config.pool.idleTimeoutMillis = 600000; // 10 minutes
  // [END cloud_sql_postgres_knex_timeout]

  // [START cloud_sql_postgres_knex_backoff]
  // 'knex' uses a built-in retry strategy which does not implement backoff.
  // 'createRetryIntervalMillis' is how long to idle after failed connection creation before trying again
  config.pool.createRetryIntervalMillis = 200; // 0.2 seconds
  // [END cloud_sql_postgres_knex_backoff]

  if (dbOrder === '1') {
    if (process.env.DB_HOST1) {
      return createTcpPool(process.env.DB_NAME1!, config);
    } else {
      return createUnixSocketPool(
        process.env.DB_NAME1!,
        `${process.env.CLOUD_SQL_CONNECTION_NAME1}`,
        config,
      );
    }
  } else {
    if (process.env.DB_HOST2) {
      return createTcpPool(process.env.DB_NAME2!, config);
    } else {
      return createUnixSocketPool(
        process.env.DB_NAME2!,
        `${process.env.CLOUD_SQL_CONNECTION_NAME2}`,
        config,
      );
    }
  }
};

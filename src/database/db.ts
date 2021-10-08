import { Knex, knex } from 'knex';
// import { logger } from '../utils/logger';
import { createPool } from '../utils/dbpool';
// import { logger } from '../index';

let pool1: Knex<any, unknown[]> | null;
let pool2: Knex<any, unknown[]> | null;
export const Pool1 = () => pool1;
export const Pool2 = () => pool2;

const ensureSchema = async (pool: Knex<any, unknown[]>) => {
  const hasTable = await pool.schema.hasTable('votes');
  if (!hasTable) {
    return pool.schema.createTable('votes', (table: any) => {
      table.increments('vote_id').primary();
      table.timestamp('time_cast', 30).notNullable();
      table.specificType('candidate', 'CHAR(6)').notNullable();
    });
  }
  //   logger.info("Ensured that table 'votes' exists");
};

export const createPoolAndEnsureSchema = async (dbOrder: string) => {
  try {
    const pool = await createPool(dbOrder);
    await ensureSchema(pool);
    return pool;
  } catch (error) {
    // logger.error(error);
    throw error;
  }
};

// [START cloud_sql_postgres_knex_connection]
/**
 * Insert a vote record into the database.
 *
 * @param {object} pool The Knex connection object.
 * @param {object} vote The vote record to insert.
 * @returns {Promise}
 */
export const insertVote = async (pool: any, vote: any) => {
  try {
    return await pool('votes').insert(vote);
  } catch (err: any) {
    throw Error(err);
  }
};
// [END cloud_sql_postgres_knex_connection]

/**
 * Retrieve the latest 5 vote records from the database.
 *
 * @param {object} pool The Knex connection object.
 * @returns {Promise}
 */
export const getVotes = async (pool: any) => {
  return await pool
    .select('candidate', 'time_cast')
    .from('votes')
    .orderBy('time_cast', 'desc')
    .limit(5);
};

/**
 * Retrieve the total count of records for a given candidate
 * from the database.
 *
 * @param {object} pool The Knex connection object.
 * @param {object} candidate The candidate for which to get the total vote count
 * @returns {Promise}
 */
export const getVoteCount = async (pool: any, candidate: any) => {
  return await pool('votes').count('vote_id').where('candidate', candidate);
};

(async () => {
  pool1 = await createPoolAndEnsureSchema('1');
  pool2 = await createPoolAndEnsureSchema('2');
})();

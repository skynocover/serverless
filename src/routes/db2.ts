import express, { Request, Response, NextFunction } from 'express';
import { createPoolAndEnsureSchema, getVoteCount, getVotes, insertVote } from '../database/db';
// import { logger } from '../utils/logger';
import { pool2 } from '../database/db';

const routes = express.Router();

routes.get('/db2', async (req, res) => {
  let pool = pool2 || (await createPoolAndEnsureSchema('2'));
  try {
    // Query the total count of "TABS" from the database.
    const tabsResult = await getVoteCount(pool, 'TABS');
    const tabsTotalVotes = parseInt(tabsResult[0].count);
    // Query the total count of "SPACES" from the database.
    const spacesResult = await getVoteCount(pool, 'SPACES');
    const spacesTotalVotes = parseInt(spacesResult[0].count);
    // Query the last 5 votes from the database.
    const votes = await getVotes(pool);
    // Calculate and set leader values.
    let leadTeam = '';
    let voteDiff = 0;
    let leaderMessage = '';
    if (tabsTotalVotes !== spacesTotalVotes) {
      if (tabsTotalVotes > spacesTotalVotes) {
        leadTeam = 'TABS';
        voteDiff = tabsTotalVotes - spacesTotalVotes;
      } else {
        leadTeam = 'SPACES';
        voteDiff = spacesTotalVotes - tabsTotalVotes;
      }
      leaderMessage = `${leadTeam} are winning by ${voteDiff} vote` + (voteDiff > 1 ? 's' : '');
    } else {
      leaderMessage = 'TABS and SPACES are evenly matched!';
    }
    res.render('index.pug', {
      votes: votes,
      tabsCount: tabsTotalVotes,
      spacesCount: spacesTotalVotes,
      leadTeam: leadTeam,
      voteDiff: voteDiff,
      leaderMessage: leaderMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Unable to load page; see logs for more details.').end();
  }
});

routes.post('/db2', async (req, res) => {
  const pool = pool2 || (await createPoolAndEnsureSchema('2'));
  // Get the team from the request and record the time of the vote.
  const { team } = req.body;
  const timestamp = new Date();

  if (!team || (team !== 'TABS' && team !== 'SPACES')) {
    res.status(400).send('Invalid team specified.').end();
    return;
  }

  // Create a vote record to be stored in the database.
  const vote = {
    candidate: team,
    time_cast: timestamp,
  };

  // Save the data to the database.
  try {
    await insertVote(pool, vote);
  } catch (err) {
    // logger.error(`Error while attempting to submit vote:${err}`);
    res.status(500).send('Unable to cast vote; see logs for more details.').end();
    return;
  }
  res.status(200).send(`Successfully voted for ${team} at ${timestamp}`).end();
});

export { routes as db2 };

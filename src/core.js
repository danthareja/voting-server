import { List, Map } from 'immutable'

export function setEntries(state, entries) {
  // List() converts and iteratible to an immutable List
  return state.set('entries', List(entries))
}

export function next(state) {
  const entries = state
    .get('entries')
    .concat(getWinners(state.get('vote')))

  if (entries.size === 1) {
    return state
      .remove('vote')
      .remove('entries')
      .set('winner', entries.first())
  }
  
  // Merge overwrites existing properties with those passed in
  return state.merge({
    vote: Map({ pair: entries.take(2) }),
    entries: entries.skip(2)
  })
}

export function vote(state, entry) {
  // Navigate to state.vote.tally[entry] and apply the function
  // If any keys are missing along the path, create new Maps() in their place
  // If the value at the end is missing, initialize with '0'
  return state.updateIn(
    ['vote', 'tally', entry],
    0,
    (tally) => tally + 1
  )
}

function getWinners(vote) {
  if (!vote) return []

  const [a, b] = vote.get('pair')
  const aVotes = vote.getIn(['tally', a], 0) // vote.tally[a] || 0
  const bVotes = vote.getIn(['tally', b], 0)

  if (aVotes > bVotes) return [a];
  else if (bVotes > aVotes) return [b];
  else return [a,b];
}

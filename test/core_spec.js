import { List, Map, fromJS } from 'immutable'
import { expect } from 'chai'

import { setEntries, next, vote } from '../src/core'

describe('application logic', () => {

  describe('setEntries', () => {

    it('adds the entries to the state', () => {
      const state = Map()
      const entries = List.of('Trainspotting', '28 Days Later')
      
      const nextState = setEntries(state, entries)

      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }))
    })

    it('converts array to immutable', () => {
      const state = Map()
      const entries = ['Trainspotting', '28 Days Later']
      
      const nextState = setEntries(state, entries)

      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }))
    })
  })

  describe('next', () => {

    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      })

      const nextState = next(state)

      expect(nextState).to.equal(Map({
        entries: List.of('Sunshine'),
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        })
      }))

      expect(state).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      }))
    })

    // fromJS notation below. it is more concise

    it('puts the winner of the current vote back to entries', () => {
      const state = fromJS({
        entries: ['Sunshine', 'Millions', '127 Hours'],
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            'Trainspotting': 4,
            '28 Days Later': 5
          }
        }
      })

      const nextState = next(state)

      expect(nextState).to.equal(fromJS({
        entries: ['127 Hours', '28 Days Later'],
        vote: {
          pair: ['Sunshine', 'Millions']
        }
      }))
    })

    it('puts both vote entries back if tied', () => {
      const state = fromJS({
        entries: ['Sunshine', 'Millions', '127 Hours'],
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            'Trainspotting': 5,
            '28 Days Later': 5
          }
        }
      })

      const nextState = next(state)

      expect(nextState).to.equal(fromJS({
        entries: ['127 Hours', 'Trainspotting', '28 Days Later'],
        vote: {
          pair: ['Sunshine', 'Millions']
        }
      }))
    })

    it('marks the winner when just one entry left', () => {
      const state = fromJS({
        entries: [],
        vote: {
          pair: ['Trainspotting', '28 Days Later'],
          tally: {
            'Trainspotting': 4,
            '28 Days Later': 3
          }
        }
      })

      const nextState = next(state);

      expect(nextState).to.equal(Map({
        winner: 'Trainspotting'
      }))

    })

  })

  describe('vote', () => {

    it('creates a tally for the voted entry', () => {
      // Only `vote` subportion of state
      // Reducer is responsible for making sure the correct
      // subportion is picked out

      const state = fromJS({
        pair: ['Trainspotting', '28 Days Later']
      })

      const nextState = vote(state, 'Trainspotting')

      expect(nextState).to.equal(fromJS({
        pair: ['Trainspotting', '28 Days Later'],
        tally: {
          'Trainspotting': 1
        }
      }))
    })

    it('increments an existing tally for the voted entry', () => {
      const state = fromJS({
        pair: ['Trainspotting', '28 Days Later'],
        tally: {
          'Trainspotting': 4,
          '28 Days Later': 2
        }
      })

      const nextState = vote(state, 'Trainspotting')

      expect(nextState).to.equal(fromJS({
        pair: ['Trainspotting', '28 Days Later'],
        tally: {
          'Trainspotting': 5,
          '28 Days Later': 2
        }
      }))
    })
  })
})
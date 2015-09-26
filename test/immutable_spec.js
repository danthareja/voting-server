import { expect } from 'chai'
import { List, Map, fromJS } from 'immutable'

describe('immutability', () => {

  describe('a number', () => {

    function increment(currentState) {
      return currentState + 1
    }

    it('is immutable', () => {
      let state = 42
      let nextState = increment(state)

      expect(nextState).to.equal(43)
      expect(state).to.equal(42)
    })

  })

  describe('a List', () => {

    function addMove(currentState, movie) {
      return currentState.push(movie)
    }

    it('is immutable', () => {
      let state = List.of('Trainspotting', '28 Days Later')
      let nextState = addMove(state, 'Sunshine')

      expect(nextState).to.equal(List.of(
        'Trainspotting',
        '28 Days Later',
        'Sunshine'
      ))

      expect(state).to.equal(List.of(
        'Trainspotting',
        '28 Days Later'
      ))

    })

    it('can use List([a,r,g,s]) or List.of(a,r,g,s) notation', () => {
      expect(List([1,2,3,4])).to.equal(List.of(1,2,3,4))
    })

  })

  describe('a Tree', () => {

    function addMovie(currentState, movie) {
      return currentState.set(
        'movies',
        currentState.get('movies').push(movie)
      )
    }

    // Same functionality as above
    function addMovie(currentState, movie) {
      return currentState.update('movies', movies => movies.push(movie))
    }

    it('is immutable', () => {
      let state = Map({
        movies: List.of('Trainspotting', '28 Days Later')
      })
      let nextState = addMovie(state, 'Sunshine')

      expect(nextState).to.equal(Map({
        movies: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      }))

      expect(state).to.equal(Map({
        movies: List.of('Trainspotting', '28 Days Later')
      }))

    })

  })

  describe('fromJS', () => {

    it('makes writing nested data structures easier', () => {
      var mapWithoutFromJS = Map({
        name: 'Dan',
        address: Map({
          street: '6 Clarewood Mall',
          city: 'Oakland',
          state: 'CA'
        }),
        friends: List([])
      })

      var mapWithFromJS = fromJS({
        name: 'Dan',
        address: {
          street: '6 Clarewood Mall',
          city: 'Oakland',
          state: 'CA'
        },
        friends: []
      })

      expect(mapWithoutFromJS).to.equal(mapWithFromJS);

    })

  })

})

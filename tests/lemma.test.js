/* eslint-env jest */
import * as Constants from '../src/constants.js'
import Lemma from '../src/lemma.js'
import Feature from '../src/feature.js'

import Translation from '../src/translation.js'

describe('Lemma object', () => {
  let lemma, word, lemmaWithParts

  beforeAll(() => {
    // Create a test environment

    word = 'someword'
    lemma = new Lemma(word, 'lat')
    lemmaWithParts = new Lemma(word, 'lat', ['part1', 'part2'])
  })

  test('Should be initialized properly', () => {
    expect(lemma).toEqual({
      word: word,
      languageCode: 'lat',
      languageID: expect.anything(),
      principalParts: [],
      features: {}
    })
    expect(lemmaWithParts).toEqual({
      word: word,
      languageCode: 'lat',
      languageID: expect.anything(),
      principalParts: ['part1', 'part2'],
      features: {}

    })
  })

  test('Should not allow empty arguments', () => {
    expect(() => new Lemma()).toThrowError(/empty/)
  })

  test('key', () => {
    lemma.addFeatures([
      new Feature(Feature.types.part, 'noun', Constants.LANG_LATIN),
      new Feature(Feature.types.tense, 'present', Constants.LANG_LATIN)
    ])
    expect(lemma.key).toEqual('someword-lat-noun-present')
  })

  // test('Should not allow unsupported languages', () => {
  //  expect(() => new Lemma('someword', 'egyptian')).toThrowError(/not supported/)
  // })

  test('addTranslation - empty translation should give an error', () => {
    expect(() => lemma.addTranslation()).toThrowError(/empty/)
  })

  test('addTranslation - not Translation object should give an error', () => {
    expect(() => lemma.addTranslation('test translation')).toThrowError(/Translation object/)
  })

  test('addTranslation - should append Translation object as an attribute without errors', () => {
    let testTranslation = new Translation(lemma, [])
    lemma.addTranslation(testTranslation)

    expect(lemma.translation).not.toBe(undefined)
    expect(lemma.translation.lemma instanceof Lemma).toBeTruthy()
    expect(Array.isArray(lemma.translation.meanings)).toBeTruthy()
  })

  afterAll(() => {
    // Clean a test environment up
    lemma = undefined
  })
})

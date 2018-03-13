import LanguageModelFactory from './language_model_factory.js'

/**
 * A grammatical feature object, that can replace both Feature and FeatureType objects.
 */
export default class Ftr {
  /**
   *
   * @param {string} type - A type of the feature, allowed values are specified in 'type' getter.
   * @param {string | string[] | string[][]} data - Single or multiple values, in different combinations.
   *
   * If a single value with no sort order is provided, data format will be:
   *  value
   *  This value will be assigned a default sort order.
   *
   * If a single value with sort order is provided, data format will be:
   *  [[value, sortOrder]]
   *
   * If multiple values without sort order are provided, data format will be:
   *  [value1, value2, value3, ...]
   * Items will be assigned a sort order according to their order in an array, starting from one.
   *
   * If multiple values with sort order are provided, data format will be:
   *  [[value1, sortOrder1], [value2, sortOrder2], [value3, sortOrder3], ...]
   * If a sort order is omitted anywhere, it will be set to a default sort order.
   *
   * @param {symbol} languageID - A language ID of a feature
   * @param allowedValues - If feature has a restricted set of allowed values, here will be a list of those
   * values. An order of those values can define a sort order.
   */
  constructor (type, data, languageID, allowedValues = []) {
    if (!Ftr.isAllowedType(type)) {
      throw new Error('Features of "' + type + '" type are not supported.')
    }
    if (!data) {
      throw new Error('Feature should have a non-empty value(s).')
    }
    if (!languageID) {
      throw new Error('No language ID is provided')
    }

    this.type = type
    this.languageID = languageID
    this.allowedValues = allowedValues

    this._data = Ftr.dataValuesFromInput(data)
    this.sort()

    this.importers = new Map()
  }

  static dataValuesFromInput (data) {
    let normalized
    if (!Array.isArray(data)) {
      // Single value with no sort order
      normalized = [[data, this.defaultSortOrder]]
    } else if (!Array.isArray(data[0])) {
      // Multiple values without sort order
      normalized = data.map((v, i) => [v, i + 1])
    } else {
      normalized = data
    }
    return normalized.map(d => { return { value: d[0], sortOrder: Number.parseInt(d[1]) } })
  }

  /**
   *
   * @param featureData
   */
  static newFromFtr (featureData) {

  }

  static get types () {
    return {
      word: 'word',
      part: 'part of speech', // Part of speech
      number: 'number',
      'case': 'case',
      grmCase: 'case', // A synonym of `case`
      declension: 'declension',
      gender: 'gender',
      type: 'type',
      'class': 'class',
      grmClass: 'class', // A synonym of `class`
      conjugation: 'conjugation',
      comparison: 'comparison',
      tense: 'tense',
      voice: 'voice',
      mood: 'mood',
      person: 'person',
      frequency: 'frequency', // How frequent this word is
      meaning: 'meaning', // Meaning of a word
      source: 'source', // Source of word definition
      footnote: 'footnote', // A footnote for a word's ending
      dialect: 'dialect', // a dialect identifier
      note: 'note', // a general note
      pronunciation: 'pronunciation',
      age: 'age',
      area: 'area',
      geo: 'geo', // geographical data
      kind: 'kind', // verb kind information
      derivtype: 'derivtype',
      stemtype: 'stemtype',
      morph: 'morph', // general morphological information
      var: 'var' // variance?
    }
  }

  static isAllowedType (value) {
    return Object.values(this.types).includes(`${value}`)
  }

  static get defaultSortOrder () {
    return 1
  }

  static get joinSeparator () {
    return ' '
  }

  /**
   * Test to see if this feature allows unrestricted values.
   * @returns {boolean} true if unrestricted false if not.
   */
  get allowsUnrestrictedValues () {
    /*
    If `allowedValues` array is empty then there are no value restrictions
     */
    return this.allowedValues.length === 0
  }

  /**
   * Defines a sort order of feature values. Values are sorted according to their sort order
   * (a number starting from one). If several values have the same sort order, they will be
   * sorted alphabetically according to their values.
   * Sort order is deterministic.
   */
  sort () {
    this._data.sort((a, b) => a.sortOrder !== b.sortOrder ? a.sortOrder - b.sortOrder : a.value.localeCompare(b.value))
  }

  /**
   * Returns a single value string. If feature has a single value, this value will be returned.
   * If it has multiple values, those values will be concatenated with a default separator and
   * returned in a single string. Values composing this string are sorted according
   * to each value's sort order.
   * @return {string} A single value string.
   */
  get value () {
    return this.values.join(this.constructor.joinSeparator)
  }

  /**
   * Returns an array of string values of a feature, sorted according to each item's sort order.
   * If a feature contains a single feature, an array with one value will be returned.
   * @return {string[]} An array of string values.
   */
  get values () {
    return this._data.map(v => v.value)
  }

  /**
   * A string representation of a feature.
   * @return {string}
   */
  toString () {
    return this.value
  }

  /**
   * Examine the feature for a specific value
   * @param {string} value
   * @returns {boolean} true if the value is included in the feature's values
   */
  hasValue (value) {
    return this.values.includes(value)
  }

  /**
   * Two features are considered fully equal if they are of the same type, have the same language,
   * and the same set of feature values in the same order.
   * @param {Ftr} grmFtr - A GrmFtr object this feature should be compared with.
   * @return {boolean} True if features are equal, false otherwise.
   */
  isEqual (grmFtr) {
    return this.type === grmFtr.type &&
      LanguageModelFactory.compareLanguages(this.languageID, grmFtr.languageID) &&
      this.values === grmFtr.values
  }

  /**
   * Adds a single new value to the existing feature object.
   * This function is chainable.
   * @param {string} value - A feature value.
   * @param {number} sortOrder - A sort order.
   * @return {Ftr} - Self reference for chaining.
   */
  addValue (value, sortOrder = this.defaultSortOrder) {
    this._data.push({
      value: value,
      sortOrder: sortOrder
    })
    this.sort() // Resort an array to place an inserted value to the proper place
    return this
  }

  /**
   * Adds multiple new values to the existing feature object.
   * This function is chainable.
   * @param {string | string[] | string[][]} data - Single or multiple values, in different combinations.
   * @return {Ftr} - Self reference for chaining.
   */
  addValues (data) {
    this._data = this._data.concat(this.constructor.dataValuesFromInput(data))
    this.sort() // Resort an array to place an inserted value to the proper place
    return this
  }

  /**
   * Removes a single value from the existing feature object.
   * @param value
   */
  removeValue (value) {
    // TODO: Do we need it?
    console.warn(`This feature is not implemented yet`)
  }

  /**
   * Creates a new single value GrmFtr object of the same type and same language,
   * but with a different feature value.
   * This can be used when one feature defines a type and it is necessary
   * to create other items of the same type.
   * @param {string} value - A value of a feature.
   * @param {number} sortOrder.
   * @return {Ftr} A new Ftr object.
   */
  createFeature (value, sortOrder = this.defaultSortOrder) {
    return new Ftr(this.type, [[value, sortOrder]], this.languageID, this.allowedValues)
  }

  /**
   * Creates a multiple value GrmFtr object of the same type and same language,
   * but with a different feature values.
   * @param {string | string[] | string[][]} data - Single or multiple values, in different combinations,
   * formatted according to rules described in a Ftr constructor.
   * @return {Ftr} A new Ftr object.
   */
  createFeatures (data) {
    return new Ftr(this.type, data, this.languageID, this.allowedValues)
  }

  /**
   * Create a copy of this feature.
   */
  copy () {
    // TODO: Do we need it?
    console.warn(`This feature is not implemented yet`)
  }

  /**
   * Adds an importer to the internal list.
   * @param {FeatureImporter} importer - A `FeatureImporter` object.
   * @param {string} name - A name of an importer
   */
  addImporter (importer, name = 'default') {
    this.importers.set(name, importer)
  }

  /**
   * Adds feature values from the imported values.
   * @param {string | string[]} foreignData - A single value or an array of values from a third-party source.
   * @param {string} name - A name of an importer.
   * @return {Ftr} - A new Ftr object.
   */
  addFromImporter (foreignData, name = 'default') {
    const importer = this.importers.get(name)
    foreignData = this.constructor.dataValuesFromInput(foreignData)
    this._data.push(...foreignData.map(fv => { return { value: importer.get(fv.value), sortOrder: fv.sortOrder } }))
    this.sort()
    return this
  }

  /**
   * Creates a new feature of the same type and with the same language from the imported values.
   * @param {string | string[]} foreignData - A single value or an array of values from a third-party source.
   * @param {string} name - A name of an importer.
   * @return {Ftr} - A new Ftr object.
   */
  createFromImporter (foreignData, name = 'default') {
    const importer = this.importers.get(name)
    if (!Array.isArray(foreignData)) {
      foreignData = [foreignData]
    }
    const values = foreignData.map(fv => importer.get(fv))
    return new Ftr(this.type, values, this.languageID, this.allowedValues)
  }
}
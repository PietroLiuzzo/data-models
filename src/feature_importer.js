class FeatureImporter {
  /**
   * @param defaults
   * @param {boolean} returnUnknown - If true, and a source value is not found in the importer,
   * a source value will be returned without any change (a passthrough). If false, an Error
   * will be thrown for unknown source values.
   * @return {FeatureImporter}
   */
  constructor (defaults = [], returnUnknown = false) {
    this.hash = {}
    for (let value of defaults) {
      this.map(value, value)
    }
    this.returnUnknown = returnUnknown
    return this
  }

  /**
   * Sets mapping between external imported value and one or more library standard values. If an importedValue
   * is already in a hash table, old libraryValue will be overwritten with the new one.
   * @param {string} importedValue - External value
   * @param {Object | Object[] | string | string[]} libraryValue - Library standard value
   */
  map (importedValue, libraryValue) {
    if (!importedValue) {
      throw new Error('Imported value should not be empty.')
    }

    if (!libraryValue) {
      throw new Error('Library value should not be empty.')
    }

    this.hash[importedValue] = libraryValue
    return this
  }

  /**
   * Checks if value is in a map.
   * @param {string} importedValue - A value to test.
   * @returns {boolean} - Tru if value is in a map, false otherwise.
   */
  has (importedValue) {
    return this.hash.hasOwnProperty(importedValue)
  }

  /**
   * Returns one or more library standard values that match an external value
   * @param {string} sourceValue - External value
   * @returns {Object | string} One or more of library standard values
   */
  get (sourceValue) {
    if (this.has(sourceValue)) {
      return this.hash[sourceValue]
    } else if (this.returnUnknown) {
      return sourceValue
    } else {
      throw new Error('A value "' + sourceValue + '" is not found in the importer.')
    }
  }
}
export default FeatureImporter

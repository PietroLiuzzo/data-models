import LanguageModel from './language_model.js'
import LanguageModelFactory from './language_model_factory.js'
import * as Constants from './constants.js'
import Feature from './feature.js'
import FeatureType from './feature_type.js'

/**
 * @class  LatinLanguageModel is the lass for Latin specific behavior
 */
class GreekLanguageModel extends LanguageModel {
  /**
   * @constructor
   */
  constructor () {
    super()
    this.sourceLanguage = GreekLanguageModel.sourceLanguage
    this.contextForward = 0
    this.contextBackward = 0
    this.direction = Constants.LANG_DIR_LTR
    this.baseUnit = Constants.LANG_UNIT_WORD
    this.languageCodes = GreekLanguageModel.codes
    this.features = this._initializeFeatures()
  }

  static get languageID () {
    return Constants.LANG_GREEK
  }

  static get featureValues () {
    /*
    This could be a static variable, but then it will create a circular reference:
    Feature -> LanguageModelFactory -> LanguageModel -> Feature
     */
    return new Map([
      ...LanguageModel.featureValues,
      [
        Feature.types.grmClass,
        [
          Constants.CLASS_DEMONSTRATIVE,
          Constants.CLASS_GENERAL_RELATIVE,
          Constants.CLASS_INDEFINITE,
          Constants.CLASS_INTENSIVE,
          Constants.CLASS_INTERROGATIVE,
          Constants.CLASS_PERSONAL,
          Constants.CLASS_POSSESSIVE,
          Constants.CLASS_RECIPROCAL,
          Constants.CLASS_REFLEXIVE,
          Constants.CLASS_RELATIVE
        ]
      ],
      [
        Feature.types.number,
        [
          Constants.NUM_SINGULAR,
          Constants.NUM_PLURAL,
          Constants.NUM_DUAL
        ]
      ],
      [
        Feature.types.grmCase,
        [
          Constants.CASE_NOMINATIVE,
          Constants.CASE_GENITIVE,
          Constants.CASE_DATIVE,
          Constants.CASE_ACCUSATIVE,
          Constants.CASE_VOCATIVE
        ]
      ],
      [
        Feature.types.declension,
        [
          Constants.ORD_1ST,
          Constants.ORD_2ND,
          Constants.ORD_3RD
        ]
      ],
      [
        Feature.types.tense,
        [
          Constants.TENSE_PRESENT,
          Constants.TENSE_IMPERFECT,
          Constants.TENSE_FUTURE,
          Constants.TENSE_PERFECT,
          Constants.TENSE_PLUPERFECT,
          Constants.TENSE_FUTURE_PERFECT,
          Constants.TENSE_AORIST
        ]
      ],
      [
        Feature.types.voice,
        [
          Constants.VOICE_PASSIVE,
          Constants.VOICE_ACTIVE,
          Constants.VOICE_MEDIOPASSIVE,
          Constants.VOICE_MIDDLE
        ]
      ],
      [
        Feature.types.mood,
        [
          Constants.MOOD_INDICATIVE,
          Constants.MOOD_SUBJUNCTIVE,
          Constants.MOOD_OPTATIVE,
          Constants.MOOD_IMPERATIVE
        ]
      ],
      [
        Feature.types.dialect,
        [
          'attic',
          'epic',
          'doric'
        ]
      ]
    ])
  }

  static getFeatureType (name) {
    let featureValues = GreekLanguageModel.featureValues
    if (featureValues.has(name)) {
      return new FeatureType(name, featureValues.get(name), GreekLanguageModel.sourceLanguage)
    } else {
      throw new Error(`Feature "${name}" is not defined`)
    }
  }

  _initializeFeatures () {
    let features = super._initializeFeatures()
    let code = this.toCode()
    features[Feature.types.grmClass] = new FeatureType(Feature.types.grmClass,
      [Constants.CLASS_DEMONSTRATIVE,
        Constants.CLASS_GENERAL_RELATIVE,
        Constants.CLASS_INDEFINITE,
        Constants.CLASS_INTENSIVE,
        Constants.CLASS_INTERROGATIVE,
        Constants.CLASS_PERSONAL,
        Constants.CLASS_POSSESSIVE,
        Constants.CLASS_RECIPROCAL,
        Constants.CLASS_REFLEXIVE,
        Constants.CLASS_RELATIVE
      ],
      code)
    features[Feature.types.number] = new FeatureType(Feature.types.number, [Constants.NUM_SINGULAR, Constants.NUM_PLURAL, Constants.NUM_DUAL], code)
    features[Feature.types.grmCase] = new FeatureType(Feature.types.grmCase,
      [Constants.CASE_NOMINATIVE,
        Constants.CASE_GENITIVE,
        Constants.CASE_DATIVE,
        Constants.CASE_ACCUSATIVE,
        Constants.CASE_VOCATIVE
      ], code)
    features[Feature.types.declension] = new FeatureType(Feature.types.declension,
      [Constants.ORD_1ST, Constants.ORD_2ND, Constants.ORD_3RD], code)
    features[Feature.types.tense] = new FeatureType(Feature.types.tense,
      [Constants.TENSE_PRESENT,
        Constants.TENSE_IMPERFECT,
        Constants.TENSE_FUTURE,
        Constants.TENSE_PERFECT,
        Constants.TENSE_PLUPERFECT,
        Constants.TENSE_FUTURE_PERFECT,
        Constants.TENSE_AORIST
      ], code)
    features[Feature.types.voice] = new FeatureType(Feature.types.voice,
      [Constants.VOICE_PASSIVE,
        Constants.VOICE_ACTIVE,
        Constants.VOICE_MEDIOPASSIVE,
        Constants.VOICE_MIDDLE
      ], code)
    features[Feature.types.mood] = new FeatureType(Feature.types.mood,
      [Constants.MOOD_INDICATIVE,
        Constants.MOOD_SUBJUNCTIVE,
        Constants.MOOD_OPTATIVE,
        Constants.MOOD_IMPERATIVE
      ], code)
    // TODO full list of greek dialects
    features[Feature.types.dialect] = new FeatureType(Feature.types.dialect, ['attic', 'epic', 'doric'], code)
    return features
  }

  /**
   * @return {Symbol} Returns a language ID
   */
  static get sourceLanguage () {
    return Constants.LANG_GREEK
  }

  static get codes () {
    return [Constants.STR_LANG_CODE_GRC]
  }

  /**
   * Checks wither a language has a particular language code in its list of codes
   * @param {String} languageCode - A language code to check
   * @return {boolean} Wither this language code exists in a language code list
   */
  static hasCode (languageCode) {
    return LanguageModel.hasCodeInList(languageCode, GreekLanguageModel.codes)
  }

  // For compatibility with existing code, can be replaced with a static version
  toCode () {
    return GreekLanguageModel.toCode()
  }

  static toCode () {
    return Constants.STR_LANG_CODE_GRC
  }

  /**
   * Check to see if this language tool can produce an inflection table display
   * for the current node
   */
  canInflect (node) {
    return false
  }

  /**
   * @override LanguageModel#grammarFeatures
   */
  grammarFeatures () {
    // TODO this ideally might be grammar specific
    return [Feature.types.part, Feature.types.grmCase, Feature.types.mood, Feature.types.declension, Feature.types.tense, Feature.types.voice]
  }

  /**
   * Return a normalized version of a word which can be used to compare the word for equality
   * @param {string} word the source word
   * @returns {string} the normalized form of the word (default version just returns the same word,
   *          override in language-specific subclass)
   * @type string
   */
  static normalizeWord (word) {
    // we normalize greek to NFC - Normalization Form Canonical Composition
    if (word) {
      return word.normalize('NFC')
    } else {
      return word
    }
  }

  /**
   * @override LanguageModel#alternateWordEncodings
   */
  alternateWordEncodings (word, preceding = null, following = null, encoding = null) {
    // the original alpheios code used the following normalizations
    // 1. When looking up a lemma
    //    stripped vowel length
    //    stripped caps
    //    then if failed, tried again with out these
    // 2. when adding to a word list
    //    precombined unicode (vowel length/diacritics preserved)
    // 2. When looking up a verb in the verb paradigm tables
    //    it set e_normalize to false, otherwise it was true...
    // make sure it's normalized to NFC and in lower case
    let normalized = GreekLanguageModel.normalizeWord(word).toLocaleLowerCase()
    let strippedVowelLength = normalized.replace(
      /[\u{1FB0}\u{1FB1}]/ug, '\u{03B1}').replace(
      /[\u{1FB8}\u{1FB9}]/ug, '\u{0391}').replace(
      /[\u{1FD0}\u{1FD1}]/ug, '\u{03B9}').replace(
      /[\u{1FD8}\u{1FD9}]/ug, '\u{0399}').replace(
      /[\u{1FE0}\u{1FE1}]/ug, '\u{03C5}').replace(
      /[\u{1FE8}\u{1FE9}]/ug, '\u{03A5}').replace(
      /[\u{00AF}\u{0304}\u{0306}]/ug, '')
    let strippedDiaeresis = normalized.replace(
      /\u{0390}/ug, '\u{03AF}').replace(
      /\u{03AA}/ug, '\u{0399}').replace(
      /\u{03AB}/ug, '\u{03A5}').replace(
      /\u{03B0}/ug, '\u{03CD}').replace(
      /\u{03CA}/ug, '\u{03B9}').replace(
      /\u{03CB}/ug, '\u{03C5}').replace(
      /\u{1FD2}/ug, '\u{1F76}').replace(
      /\u{1FD3}/ug, '\u{1F77}').replace(
      /\u{1FD7}/ug, '\u{1FD6}').replace(
      /\u{1FE2}/ug, '\u{1F7A}').replace(
      /\u{1FE3}/ug, '\u{1F7B}').replace(
      /\u{1FE7}/ug, '\u{1FE6}').replace(
      /\u{1FC1}/ug, '\u{1FC0}').replace(
      /\u{1FED}/ug, '\u{1FEF}').replace(
      /\u{1FEE}/ug, '\u{1FFD}').replace(
      /[\u{00A8}\u{0308}]/ug, '')
    if (encoding === 'strippedDiaeresis') {
      return [strippedDiaeresis]
    } else {
      return [strippedVowelLength]
    }
  }

  /**
   * Get a list of valid puncutation for this language
   * @returns {String} a string containing valid puncutation symbols
   */
  getPunctuation () {
    return '.,;:!?\'"(){}\\[\\]<>/\\\u00A0\u2010\u2011\u2012\u2013\u2014\u2015\u2018\u2019\u201C\u201D\u0387\u00B7\n\r'
  }

  static getInflectionGrammar (inflection) {
    let grammar = {
      fullFormBased: false,
      suffixBased: false,
      pronounClassRequired: false
    }
    if (inflection.hasOwnProperty(Feature.types.part) &&
      Array.isArray(inflection[Feature.types.part]) &&
      inflection[Feature.types.part].length === 1) {
      let partOfSpeech = inflection[Feature.types.part][0]
      // TODO: this should be language specific
      if (partOfSpeech.value === Constants.POFS_PRONOUN) {
        grammar.fullFormBased = true
      } else {
        grammar.suffixBased = true
      }
    } else {
      console.warn(`Unable to set grammar: part of speech data is missing or is incorrect`, inflection[Feature.types.part])
    }

    grammar.pronounClassRequired =
      LanguageModelFactory.compareLanguages(GreekLanguageModel.languageID, inflection.languageID) &&
      inflection.hasOwnProperty(Feature.types.part) &&
      Array.isArray(inflection[Feature.types.part]) &&
      inflection[Feature.types.part].length >= 1 &&
      inflection[Feature.types.part][0].value === Constants.POFS_PRONOUN

    return grammar
  }

  /**
   * Determine a class of a given word (a pronoun).
   * Finds grammar class(es) in a pronoun source data that match(es) a provided pronoun.
   * @param {Form[]} forms - An array of known forms of pronouns.
   * @param {string} word - A word we need to find a matching class for.
   * @param {boolean} normalize - Whether normalized forms of words shall be used for comparison.
   * @return {Feature[]} Matching classes found in an array of Feature objects. If no matching classes found,
   * returns an empty array.
   */
  static getPronounClasses (forms, word, normalize = true) {
    let classes = []
    let matchingValues = new Set() // Will eliminate duplicated values
    let matchingForms = forms.filter(
      form => {
        let match = false
        if (form.value) {
          match = normalize
            ? GreekLanguageModel.normalizeWord(form.value) === GreekLanguageModel.normalizeWord(word)
            : form.value === word
        }
        return match
      }
    )
    for (const matchingForm of matchingForms) {
      if (matchingForm.features.hasOwnProperty(Feature.types.grmClass)) {
        matchingValues.add(matchingForm.features[Feature.types.grmClass])
      }
    }
    for (const matchingValue of matchingValues) {
      classes.push(new Feature(matchingValue, Feature.types.grmClass, GreekLanguageModel.languageID))
    }
    return classes
  }
}

export default GreekLanguageModel

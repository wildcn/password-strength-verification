
export default {
  passwordFactor: {
    englishLowerCase: true,
    englishUpperCase: true,
    arabicNumber: true,
    specialSymbols: true
  },
  passwordFactorRules: {
    englishLowerCase: 'abcdefghijklnmopqrstuvwxyz',
    englishUpperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    arabicNumber: '0123456789',
    specialSymbolsRules: /([@#$%^&\*?\(\)\[\]\{\}~!<>_\-\+=\|\.,:;”’`\/\\])/g,
  },
  passwordPolicy: {
    ignoreCase: true,
    minLength: 8,
    maxLength: 20,
    maxRepeatChars: null,
    // Prohibit special formats
    exclusion: ['email', 'website', 'blankSpace'],
    // Reject characters other than factor
    lockInFactor:true
  },
  language: "en"
}

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
    // 忽略大小写
    ignoreCase: true,
    minLength: 8,
    maxLength: 20,
    maxRepeatChars: null,
    // 排查以下校验
    exclusion: ['email', 'website','blankSpace']
  },
  language: "cn"
}
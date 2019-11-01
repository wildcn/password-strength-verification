# Password strength verification

# how to use

```

import PasswordStrengthVerification form 'password-strength-verification';
const configs = {
  passwordFactor: {
    englishLowerCase: true,
    englishUpperCase: true,
    arabicNumber: true,
    specialSymbols: true,
  },
  passwordPolicy: {
    // 忽略大小写
    ignoreCase: true,
    minLength: 8,
    maxLength: 20,
    maxRepeatChars: null,
    // 排查以下校验
    exclusion: ['email', 'website']
  },
  language: "cn"
};
const ps = new PasswordStrength(configs);

const res = ps.validate('#$fdsafasf123');
const res = ps.validate('#$adfa');
if(res === true){
  // continue
}else{
  console.log(res)
  /*
    * { message: "缺少数字", factor: "arabicNumber", val: "adfa" }
  */
}

```

# API
## constructor(options) 
```
// options:
{
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
```
## validate(val)
```
if(validate(val) === true){
  // continue;
}else{
  return {
    message:'error msg',
    factor:'validate factor if use',
    val
  }
}
```
## setLanguage(lang = 'en')

## mergeLanguage(lang)
```
// lang:
{
  en: {
    error: {
      invalidArguments: 'invalid valid argument',
      invalidRule: 'Missing prerequisite rule',
      unknown: 'unknown Error',
      englishLowerCase: 'Missing lowercase',
      englishUpperCase: 'Missing capital letters',
      arabicNumber: 'Missing arabic number',
      specialSymbols: 'Missing special symbol',
      blankSpace: 'Cannot contain blank space',
      maxLength: 'Maximum character limit exceeded',
      minLength: 'Minimum characters not met',
      email: 'Do not use email address',
      website: 'Do not use web address',
      outOfRange: 'Exceeded allowed character range'
    },
    word: {
      englishLowerCase: 'English small letters',
      englishUpperCase: 'Capital letters',
      arabicNumber: 'Arabic numerals',
      specialSymbols: 'Special symbols'
    }
  }
}
```
## mergeRules(rules)
```
//rules:

{
  email: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  website: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
  blankSpace: / /g,
}


```


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
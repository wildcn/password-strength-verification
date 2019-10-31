import { isPlainObject } from './utils';
import config from './config';
import lang from './lang';
import rules from './rules';



class PasswordStrength {
  constructor(opts) {
    if (!opts) {
      console.info('[password-strength-verificaiton] no passwordConfig,passwordPolicy inject');
      opts = config;
      console.info('[password-strength-verificaiton] use config: ' + JSON.stringify(opts));
    }

    this.lang = lang;
    const { passwordFactor, passwordFactorRules, passwordPolicy, language } = opts;
    this.passwordFactor = passwordFactor || config.passwordFactor;
    this.passwordPolicy = passwordPolicy || config.passwordPolicy;
    this.passwordFactorRules = passwordFactorRules || config.passwordFactorRules;
    this.language = language || config.language;
    this.rules = rules;
  }
  get msg () {
    return this.lang[this.language];
  }
  setLanguage (language) {
    if (lang[language]) {
      this.language = language;
    }
  }
  // 支持对于错误信息的自定义
  mergeLanguage (data) {
    if (isPlainObject(data)) {
      Object.assign(this.lang, data);
    }
  }
  // 支持添加自定义规则
  mergeRules (data) {
    if (isPlainObject(data)) {
      Object.assign(this.rules, data);
    }
  }
  validate (val) {
    if (!val) {
      return this.msg.error.invalidArguments;
    }
    try {
      // this.validatePolicy(val);
      this.validateFactors(val);
    } catch (err) {
      return err;
    }
    return true;
  }
  getValidFactor () {
    return Object.keys(this.passwordFactor).filter(key => this.passwordFactor[key]);
  }
  validateFactors (val) {
    // validate factor
    const validateFactors = this.getValidFactor();
    let unionCondition = [];
    let specialLength = 0;
    validateFactors.forEach(factor => {
      const str = this.passwordFactorRules[factor] || this.passwordFactorRules[factor + 'Rules'];

      if (!str) {
        throw {
          message: this.msg.error.invalidRule,
          factor,
          val
        }
      }
      const condition = this.passwordPolicy.ignoreCase ? 'i' : '';
      // 是否忽略大小写
      let reg;
      if (str instanceof RegExp) {
        reg = str;
        const match = val.match(str);
        if (match) {
          specialLength += match.length;
        }
        
      } else {
        reg = new RegExp(`[${str}]`, condition);
        unionCondition.push(str);
      }

      if (!reg.test(val)) {
        // eslint-disable-next-line no-throw-literal
        throw {
          message: this.msg.error[factor] || this.msg.error.unknown,
          factor,
          val
        };
      }
    });

    const unionReg = new RegExp(`[${unionCondition.join()}]`,'g');
    if (val.match(unionReg).length + specialLength !== val.length) {
      throw {
        message: `${this.msg.error.outOfRange},仅允许包含${validateFactors.map(factor=>this.msg.word[factor]).join(',')}`,
        val,
      };
    }
  }
  validatePolicy (val) {
    const { minLength, maxLength } = this.passwordPolicy;
    if (minLength && val.length < minLength) {
      throw {
        message: this.msg.error['minLength'],
        factor: 'minLength',
        minLength,
        val
      }
    }

    if (maxLength && val.length > maxLength) {
      throw {
        message: this.msg.error['maxLength'],
        factor: 'maxLength',
        maxLength,
        val
      }
    }
    this.validateExclusion(val);
  }
  validateExclusion (val) {
    const { exclusion } = this.passwordPolicy;
    if ([].concat(exclusion).length) {
      exclusion.forEach(factor => {

        if (rules[factor]) {
          if (rules[factor].test(val)) {
            throw {
              message: this.msg.error[factor],
              factor,
              val
            }
          }
        } else {
          console.error('[password-strength-verificaiton] nivalid exclusion rule , ' + factor);
        }
      })
    }
  }
}

export default PasswordStrength;

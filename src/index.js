import { isPlainObject } from './utils';
import config from './config';
import lang from './lang';
import rules from './rules';

class PasswordStrength {
  constructor(opts) {
    if (!opts) {
      console.error('[password-strength-verificaiton] no passwordConfig,passwordPolicy inject');
      opts = config;
      console.error('[password-strength-verificaiton] use config: ' + JSON.stringify(opts));
    }else{
      Object.assign(opts,config);
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
  /**
   * set error message language, Default provided language：cn en, you can use setLanguage() to change your language , and use mergeLanguage() to add your lang.
   * @param {String}} language cn en ...
   */
  setLanguage (language) {
    if (lang[language]) {
      this.language = language;
    }
  }
  /**
   * support to add your language like {jp:{invalidArguments:'パラメータエラー'}}
   */
  mergeLanguage (data) {
    if (isPlainObject(data)) {
      Object.assign(this.lang, data);
    }
  }
  // custom exclusion rules,if you want to do it 
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
      this.validatePolicy(val);
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
    validateFactors.forEach(factor => {
      const str = this.passwordFactorRules[factor] || this.passwordFactorRules[factor + 'Rules'];

      if (!str) {
        throw {
          message: this.msg.error.invalidRule,
          factor,
          val
        }
      }
      // ignoreCase condition
      const condition = this.passwordPolicy.ignoreCase ? 'i' : '';
      let reg;
      if (str instanceof RegExp) {
        reg = str;
      } else {
        reg = new RegExp(`[${str}]`, condition);
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
    // validate password factor
    if (this.passwordPolicy.lockInFactor) {
      const factors = Object.keys(this.passwordFactor);
      const commonFactorReg = new RegExp(`[${factors.map(factor => this.passwordFactorRules[factor]).join('')}]`, 'g');
      const specialReg = this.passwordFactorRules.specialSymbolsRules;

      const commonFactorCount = val.match(commonFactorReg);
      const specialCount = val.match(specialReg);
      if ((commonFactorCount ? commonFactorCount.length : 0) + (specialCount ? specialCount.length : 0) !== val.length) {
        throw {
          message: `${this.msg.error.outOfRange},only allow ${factors.map(factor => this.msg.word[factor]).join(',')}`,
          val,
        };
      }
    }
  }
  /**
   * filter policy , see ./config.passwordPolicy
   * @param {String} val validate argument
   */
  validatePolicy (val) {
    // validate min limit
    const { minLength, maxLength } = this.passwordPolicy;
    if (minLength && val.length < minLength) {
      throw {
        message: this.msg.error['minLength'],
        factor: 'minLength',
        minLength,
        val
      }
    }
    // validate max limit
    if (maxLength && val.length > maxLength) {
      throw {
        message: this.msg.error['maxLength'],
        factor: 'maxLength',
        maxLength,
        val
      }
    }
    // validate exclusion rule
    this.validateExclusion(val);
  }
  /**
   * Regular rules to exclude by default， just like domain/website/email...
   */
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

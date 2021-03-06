/* eslint-disable */

const Decimal = require("decimal.js").default;

Number.prototype.setDigit = String.prototype.setDigit = function (digit) {
  // 返回字符串，不能直接用> <对比，要对比的时候请用lt,lte,gt,gte 或者 a-b>0这种方式
  const str = String(this);
  if(str.indexOf('.')<0||str.indexOf('e-')>=0){
    return str;
  }
  const parts = str.split(".");

  if (parts[1] && parts[1].length > digit) {
    return parts[0] + (digit > 0 ? "." : "") + parts[1].substr(0, digit);
  }
  return str;
};

Number.prototype.lt = String.prototype.lt = function (num) {
  return (new Decimal(this.toString())).lessThan(num)
}

Number.prototype.lte = String.prototype.lte = function (num) {
  return (new Decimal(this.toString())).lessThanOrEqualTo(num)
}

Number.prototype.gt = String.prototype.gt = function (num) {
  return (new Decimal(this.toString())).greaterThan(num)
}

Number.prototype.gte = String.prototype.gte = function (num) {
  return (new Decimal(this.toString())).greaterThanOrEqualTo(num)
}

String.prototype.limitDigit = function (limit, defDigit = 8) {
  const str = (this || "").toString().trim();
  const digit = str.obtainMaxDigit(limit, defDigit);
  return str.setDigit(digit);
};

String.prototype.hideMiddleChars = function (hiddenCount = 4) {
  const str = (this || "").toString().trim();
  const l = str.length
  if (l <= hiddenCount) {
    return str
  }
  const hidden = Array(hiddenCount).fill('*').join('')
  const left = Math.floor((l - hiddenCount) / 2)
  return str.slice(0, left) + hidden + str.slice(left + hiddenCount)
}

String.prototype.obtainMaxDigit = function (limit, defDigit = 8, array, keyFn) {
  array = array || [(this || "")];
  keyFn = keyFn || function (number) {
    return number;
  };

  let result = defDigit;
  let max = "0";
  let extra = 0;
  const len = array.length;
  for (let i = 0; i < len; i++) {
    const item = array[i];
    const temp = (keyFn(item) + "").trim();
    const num = temp.replace(/,/g, "");
    if (!isNaN(num)) {
      if (max.decimalCmp(num) === -1) {
        max = num;
        extra = temp.length - num.length;
      }
    }
  }
  max = max.toLowerCase().scientificToDecimal();
  const parts = max.split(".");

  const maxLenDist = (parts[0].length + extra) + 1 + defDigit;
  const offset = maxLenDist - limit;
  if (offset <= 0) { // 可以满足
    return defDigit;
  }
  result = defDigit - offset;
  return result >= 0 ? result : 0;
};

String.prototype.scientificToDecimal = function () {
  let num = (this || "0").toLowerCase();
  if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    let prefix = "";
    if (num[0] === "-") {
      prefix = "-";
      num = num.substring(1);
    }
    const zero = "0";
    const parts = num.split("e");
    const e = parts.pop();
    let l = Math.abs(e);
    const sign = e / l;
    const coeffArray = parts[0].split(".");
    if (sign === -1) {
      num =
        prefix + zero + "." + new Array(l).join(zero) + coeffArray.join("");
    } else {
      const dec = coeffArray[1];
      if (dec) {
        l = l - dec.length;
      }
      num = prefix + coeffArray.join("") + new Array(l + 1).join(zero);
    }
  }
  return num;
};
String.prototype.simplify = function (length = 5, str = "...") {
  if (this.length <= length || length <= 0) {
    return this;
  }
  return this.substr(0, length) + str;
};
String.prototype.formatCurrency = function (digit = 10,
  charDec = ".",
  charSep = ",") {
  let n = this || "0";
  let prefix = "";
  if (n[0] === "-") {
    prefix = "-";
    n = n.substring(1);
  }
  n = n.scientificToDecimal();

  const decimalArray = n.toString().split(".");
  decimalArray[0] = decimalArray[0] || "";
  decimalArray[1] = decimalArray[1] || "";

  const integerLen = decimalArray[0].length;
  const paddingZeroCount =
    digit - ((integerLen > 0 ? integerLen : 1) + decimalArray[1].length) - 1;
  let integerString = "";
  for (let i = decimalArray[0].length - 1; i >= 0; i--) {
    if ((decimalArray[0].length - i) % 3 === 0 && i > 0) {
      // 加逗号
      integerString = charSep + decimalArray[0][i] + integerString;
    } else {
      integerString = decimalArray[0][i] + integerString;
    }
  }
  if (integerString === "") {
    integerString = "0";
  }

  let decimalString = decimalArray[1];
  if (paddingZeroCount > 0) {
    // 补0
    for (let i = 0; i < paddingZeroCount; i++) {
      decimalString += "0";
    }
  } else if (paddingZeroCount < 0) {
    // 去掉0
    decimalString = decimalString.substring(
      0,
      decimalString.length + paddingZeroCount
    );
  }
  return decimalString === ""
    ? prefix + integerString
    : prefix + integerString + charDec + decimalString;
};

/**
 * [格式化数字]
 * @param  {[Number]} c       [精确到小数位位数]
 * @param  {[String]} charDec [小数点符号，默认点号]
 * @param  {[String]} charSep [每三位数字的分隔符，默认逗号]
 * @param  {[Boolean]} noZero  [小数位是否需要补0，默认true]
 * @param  {[String]} lang    [单位语言]
 *
 * @return {[String]}         [格式化后的数字字符串]
 */
Number.prototype.formatMoney = String.prototype.formatMoney = function (c = 0, charDec = '.', charSep = ',', noZero = true, lang) {
  let n = String(this || "0");
  let prefix = "";
  if (n[0] === "-" || n[0] === '+') {
    prefix = n[0];
    n = n.substring(1);
  }
  let rounded = n.toString().round(c);
  rounded = rounded.scientificToDecimal();
  let postfix = "";

  if (lang) {
    let integer = parseInt(rounded, 10).toString();
    if (/zh/i.test(lang)) {
      if (integer * 1 >= 1000000) {
        postfix = "万";
        integer = integer.substring(0, integer.length - 2);
        integer = (integer / 100).toString();
      }
    } else {
      if (integer * 1 >= 1000000000) {
        postfix = "billion";
        integer = integer.substring(0, integer.length - 7);
        integer = (integer / 100).toString();
      } else if (integer * 1 >= 1000000 && integer * 1 < 1000000000) {
        postfix = "million";
        integer = integer.substring(0, integer.length - 4);
        integer = (integer / 100).toString();
      }
    }
    if (postfix) {
      rounded = integer;
    }
  }

  const decimalArray = rounded.split(".");
  let integerString = "";
  // 三位加逗号
  for (let i = decimalArray[0].length - 1; i >= 0; i--) {
    if ((decimalArray[0].length - i) % 3 === 0 && i > 0) {
      // 加逗号
      integerString = charSep + decimalArray[0][i] + integerString;
    } else {
      integerString = decimalArray[0][i] + integerString;
    }
  }
  if (integerString === "") {
    integerString = "0";
  }

  let decimalString =
    decimalArray.length > 1 ? decimalArray[1].substring(0, c) : "";

  if (c > 0 && !noZero) {
    // 不足位数的补0
    if (decimalString.length < c) {
      const len = c - decimalString.length;
      for (let i = 0; i < len; i++) {
        decimalString += "0";
      }
    }
    return (prefix + integerString + charDec + decimalString + " " + postfix).trim();
  } else {
    return (
      prefix +
      integerString +
      (c > 0 && decimalString * 1 > 0 ? charDec + decimalString : "") +
      " " +
      postfix
    ).trim();
  }
};

String.prototype.decimalCmp = function (b) {
  const n = ((this || "0").toString() || "0").trim();
  const bb = ((b || "0").toString() || "0").trim();
  return new Decimal(n.toString()).cmp(new Decimal(bb.toString()));
};
// 创建Decimal
String.prototype.Decimal = function () {
  const n = ((this || "0").toString() || "0").trim();
  return new Decimal(n.toString());
};

// 加
String.prototype.decimalAdd = function (c) {
  const n = ((this || "0").toString() || "0").trim();
  const m = ((c || "0").toString() || "0").trim();

  return new Decimal(n.toString()).add(new Decimal(m.toString())).toString();
};

// 减
String.prototype.decimalMinus = function (c) {
  const n = ((this || "0").toString() || "0").trim();
  const m = ((c || "0").toString() || "0").trim();

  return new Decimal(n.toString()).minus(new Decimal(m.toString())).toString();
};

// 乘
String.prototype.decimalMul = Number.prototype.decimalMul = function (c) {
  const n = ((this || "0").toString() || "0").trim();
  const m = ((c || "0").toString() || "0").trim();

  return new Decimal(n.toString()).mul(new Decimal(m.toString())).toString();
};

// 除
String.prototype.decimalDiv = Number.prototype.decimalDiv = function (c) {
  const n = ((this || "0").toString() || "0").trim();
  const m = ((c || "0").toString() || "0").trim();

  return new Decimal(n.toString()).div(new Decimal(m.toString())).toString();
};

// 小数位数
String.prototype.round = function (c) {
  const n = ((this || "0").toString() || "0").trim();
  let m = 1;
  for (let i = 0; i < c; i++) {
    m = m * 10;
  }
  return Decimal(n.toString())
    .times(m)
    .floor()
    .div(new Decimal(m.toString()))
    .toString();
};

// 银行卡
String.prototype.formatCard = function () {
  let cardString = "";
  const s = this;

  for (let i = 0; i < s.length; i++) {
    if ((i + 1) % 4 === 0) {
      cardString += s[i] + " ";
    } else {
      cardString += s[i];
    }
  }

  return cardString;
};

// 格式化 交易id
String.prototype.formatTxId = function () {
  let cardString = "";
  const s = this;

  for (let i = 0; i < s.length; i++) {
    if ((i + 1) % 32 === 0) {
      cardString += s[i] + " ";
    } else {
      cardString += s[i];
    }
  }
  return cardString;
};

String.prototype.lastChars = function (len = 6) {
  const s = this;
  if (s.length <= len) return s
  return s.substr(s.length - len)
};

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function (predicate) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined')
      }

      const o = Object(this)
      const len = o.length >>> 0

      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function')
      }

      const thisArg = arguments[1]
      let k = 0

      while (k < len) {
        const kValue = o[k]
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue
        }
        k++
      }

      return undefined
    },
  })
}

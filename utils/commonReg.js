function regCode(_code) {
  let regN = /^\d{6}$/;
  if (!regN.test(_code)) {
    return false;
  } else {
    return true;
  }
}
function regPhone(phone) {
  let regP = /^1[3-9]\d{9}$/;
  if (!regP.test(phone)) {
    return false;
  } else {
    return true;
  }
}

module.exports.regPhone = regPhone
exports.regCode = regCode
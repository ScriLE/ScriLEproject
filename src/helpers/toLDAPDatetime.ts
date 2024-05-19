
function pad2(num: number) {
  if (num < 10) return '0' + num
  return '' + num
}

function pad4(num: number) {
  if (num < 10) return '000' + num
  if (num < 100) return '00' + num
  if (num < 1000) return '0' + num
  return '' + num
}

export const  toGeneralizedTime = function(date: Date) {
  var ms = date.getUTCMilliseconds()
  var fraction = (ms ? '.' + ms : '')
  return '' +
    pad4(date.getUTCFullYear()) +
    pad2(date.getUTCMonth() + 1) +
    pad2(date.getUTCDate()) +
    pad2(date.getUTCHours()) +
    pad2(date.getUTCMinutes()) +
    pad2(date.getUTCSeconds()) +
    fraction + 'Z'
}
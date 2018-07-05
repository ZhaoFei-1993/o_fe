function checkBrowser(cb) {
  const elem = document.getElementById('J_browserAlert')
  if (!elem) {
    setTimeout(function () {
      checkBrowser(cb)
    }, 1000)
  } else {
    cb(elem)
  }
}

checkBrowser(function (elem) {
  // elem.style.display=/webkit|firefox/i.test(navigator.userAgent)?"none":"block"
  if (!/webkit|firefox/i.test(navigator.userAgent)) {
    if (!/incompatible/i.test(location.href)) {
      location.href = '/incompatible'
    }
  }
})

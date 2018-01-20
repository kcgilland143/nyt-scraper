function textFlash(target, text, ms) {
  target.text(text)
  target.show()
  setTimeout(function () {
    target.hide()
  }, ms)
}
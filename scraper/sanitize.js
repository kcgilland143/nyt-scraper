function sanitize (string) {
  return string.replace(/\s*\.*/g, '')
}

module.exports = sanitize
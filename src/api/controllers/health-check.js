const getStatus = (req, res, next) => res.json({ status: 'success' })

module.exports = {
  getStatus,
}

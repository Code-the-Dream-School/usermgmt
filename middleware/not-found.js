const notFound = (req, res) => {
  if (req.is('application/json')) {
      return res.status(404).json({message: 'That route does not exist.'})
  }
  res.status(404).send('That route does not exist.')
} 
module.exports = notFound

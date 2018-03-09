import server from './app'

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})

server.on('error', console.error)

const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 8000
const BASE = process.cwd()

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain'
}

function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('404: Not Found')
}

const server = http.createServer((req, res) => {
  try {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`)
    let pathname = decodeURIComponent(reqUrl.pathname)
    if (pathname === '/') pathname = '/index.html'

    // Avoid directory traversal
    const safePath = path.normalize(path.join(BASE, pathname))
    if (!safePath.startsWith(BASE)) return send404(res)

    fs.stat(safePath, (err, stats) => {
      if (err) return send404(res)
      if (stats.isDirectory()) {
        const index = path.join(safePath, 'index.html')
        return fs.readFile(index, (e, data) => {
          if (e) return send404(res)
          res.writeHead(200, { 'Content-Type': MIME['.html'] })
          res.end(data)
        })
      }

      fs.readFile(safePath, (e, data) => {
        if (e) return send404(res)
        const ext = path.extname(safePath).toLowerCase()
        const type = MIME[ext] || 'application/octet-stream'
        res.writeHead(200, { 'Content-Type': type })
        res.end(data)
      })
    })
  } catch (err) {
    send404(res)
  }
})

server.on('error', (err) => {
  console.error('Server error:', err.message)
  process.exit(1)
})

server.listen(PORT, () => {
  console.log(`MarketYog static server running: http://localhost:${PORT}`)
})

module.exports = server

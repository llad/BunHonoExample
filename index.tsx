import { Hono } from 'hono'
import { Database } from "bun:sqlite";
import {
  Content,
  RequestList,
  Home
} from './html'

const db = new Database("mydb.sqlite");
db.run("CREATE TABLE IF NOT EXISTS requests (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, method TEXT, created DATETIME DEFAULT CURRENT_TIMESTAMP)")

const app = new Hono()

// middleware

app.use('*', async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  console.log(JSON.stringify(c.req.url))
  
  db.run("INSERT INTO requests (method, url) VALUES (?, ?)", c.req.method, c.req.url)
  await next()
})

// routes 

app.get('/', (c) => {
  const latestRequest = (db.query("SELECT * FROM requests ORDER BY id DESC").get())
 const props = {
    id: latestRequest.id,
   method: latestRequest.method,
    request: latestRequest.request,
   created: latestRequest.created,
    siteData: {
      title: 'home',
    },
  }
  return c.html(<Home {...props} />)
})

app.get('/requests', (c) => {
  const latestRequests = (db.query("SELECT * FROM requests ORDER BY id DESC").all())
  const props = {
    requests: latestRequests,
    siteData: {
      title: 'all requests',
    },
  }
  return c.html(<RequestList {...props} />)
})


app.get('/requests/:id', (c) => {
  const id = c.req.param('id')
  const request = (db.query("SELECT * FROM requests WHERE id = ?").get(id))
  const props = {
    request: request,
    siteData: {
      title: 'request by id',
    },
  }
  return c.html(<Content {...props} />)
})

export default {
  port: 3000,
  fetch: app.fetch,
}
    

import { Hono } from 'hono'
import { Database } from "bun:sqlite";
import {
  Content,
  RequestList,
  Home
} from './html'

const db = new Database("mydb.sqlite");
db.run("CREATE TABLE IF NOT EXISTS requests (id INTEGER PRIMARY KEY AUTOINCREMENT, request TEXT)")

const app = new Hono()

// middleware test

app.use('*', async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  
  db.run("INSERT INTO requests (request) VALUES (?)", c.req.url)
  await next()
})

// routes 

app.get('/', (c) => {
  const latestRequest = (db.query("SELECT * FROM requests ORDER BY id DESC").get())
 const props = {
    id: latestRequest.id,
    request: latestRequest.request,
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
  const latestRequest = (db.query("SELECT * FROM requests WHERE id = ?").get(id))
  const props = {
    id: latestRequest.id,
    request: latestRequest.request,
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
    

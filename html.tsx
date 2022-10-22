import { html } from 'hono/html'

interface SiteData {
  title: string
  children?: any
}

const Layout = (props: SiteData) => html`<!DOCTYPE html>
  <html>
    <head>
      <title>${props.title}</title>
    </head>
    <nav>
      <a href="/">home</a> |
      <a href="/requests">all requests</a> 
    </nav>
    <body>
      ${props.children}
    </body>
  </html>`

export const Home = (props: { siteData: SiteData; id: number; request: string }) => (
  <Layout {...props.siteData}>
    <h1>{props.siteData.title}</h1>
    <p>hi, you just requested:</p>
    <h2>{props.request}</h2>
    <p>we stored that in our database on {props.created} with id: {props.id}</p>
    <p>see more about it at <a href={"/requests/" + props.id}>/requests/{props.id}</a></p>
  </Layout>
)


export const Content = (props: { siteData: SiteData; request: object }) => (
  <Layout {...props.siteData}>
    <h1>{props.request.id} - {props.request.created}</h1>
    <h2>[{props.request.method}] - {props.request.url}</h2>
    
  </Layout>
)

export const RequestList = (props: { siteData: SiteData; requests: object[] }) => (
    <Layout {...props.siteData}>
      <h1>{props.siteData.title}</h1>
      <ul>
        {props.requests.map((request) => {
          return <li><a href={"/requests/" + request.id}>{request.id}</a> - {request.request}</li>
        })}
      </ul>
    </Layout>
)


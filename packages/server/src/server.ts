import { ApolloServer } from 'apollo-server-express';
import * as GraphiQL from 'apollo-server-module-graphiql';
import * as cors from 'cors';
import * as express from 'express';

import schema from './schema';

import { execute, subscribe } from 'graphql';
import { createServer, Server } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import * as url from 'url';

import facilityRecords from './facilityRecords';

type ExpressGraphQLOptionsFunction = (req?: express.Request, res?: express.Response) => any | Promise<any>;

function graphiqlExpress(options: GraphiQL.GraphiQLData | ExpressGraphQLOptionsFunction) {
  const graphiqlHandler = (req: express.Request, res: express.Response, next: any) => {
    const query = req.url && url.parse(req.url, true).query;
    GraphiQL.resolveGraphiQLString(query, options, req).then(
      (graphiqlString: any) => {
        res.setHeader('Content-Type', 'text/html');
        res.write(graphiqlString);
        res.end();
      },
      (error: any) => next(error)
    );
  };

  return graphiqlHandler;
}

export default async (port: number): Promise<Server> => {
  facilityRecords.init();

  const app = express();

  const server: Server = createServer(app);

  app.use('*', cors({ origin: 'http://localhost:3000' }));

  const apolloServer = new ApolloServer({
    playground: false,
    schema
  });

  apolloServer.applyMiddleware({ app, path: '/graphql' });

  if (module.hot) {
    app.use(
      '/graphiql',
      graphiqlExpress({
        endpointURL: '/graphql',
        query: `query list {
  facilities(offset: 0, limit: 10) {
    total
    items {
      id
      name
      address
      size
    }
  }
}`,
        subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`
      })
    );
  }

  return new Promise<Server>(resolve => {
    server.listen(port, () => {
      // tslint:disable-next-line
      new SubscriptionServer(
        {
          execute,
          schema,
          subscribe
        },
        {
          path: '/subscriptions',
          server
        }
      );
      resolve(server);
    });
  });
};

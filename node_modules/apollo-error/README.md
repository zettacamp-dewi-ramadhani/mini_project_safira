# Apollo Error

Custom payload in Apollo GraphQL server.

## Usage

### Install via npm 

```sh
npm install apollo-error
```

### Bind with Apollo Server

Showing example for Express below.

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress } from 'apollo-server-express';
import { formatError } from 'apollo-error';

import schema from './graphql/schema';
 
const app = express();
 
app.use('/graphql', bodyParser.json(), graphqlExpress({
    formatError,
    schema
}));
 
app.listen(3000);
```

### Throw ApolloError

```javascript
throw new ApolloError(message, {
    /* your custom payload here */
    foo: 'bar',
    ...
});
```

### Response handling

You can access the custom payload in your response handler like the following.

```javascript
if(response.errors) {
    const myErrorMessage = response.errors[0].message;
    const myErrorExtras = response.errors[0].data;
}
```
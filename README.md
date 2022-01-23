# nodesite.eu-core

This package provides a connect to nodesite.eu, or, more abstractly, any socket.io v3 server.

### Usage:

```typescript
import { connect } from 'nodesite.eu-core';

const socket = connect();
```

Connecting to another host:

```typescript
import { connect } from 'nodesite.eu-core';

const socket = connect('wss://other_host');
```

For debug information, either set the env. var. `NODESITE_EU_CORE_DEBUG` to `1`, or pass a [logger](https://github.com/lvkdotsh/logger) as the second parameter:

```typescript
import { createLogger } from '@lvksh/logger';
import { connect } from 'nodesite.eu-core';

const socket = connect(
	undefined,
	createLogger({
		received: 'from nodesite.eu',
		sent: 'to nodesite.eu',
	})
);
```

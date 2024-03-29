import { createLogger, Logger } from '@lvksh/logger';
import { io } from 'socket.io-client';

const { process } = globalThis as any;

const debug = process?.env?.NODESITE_EU_CORE_DEBUG;
const endpoint =
	process?.env?.NODESITE_EU_CORE_ENDPOINT || `wss://nodesite.eu:20122`;

export function connect(
	server?: string,
	...loggers: Logger<'received' | 'sent'>[]
) {
	if (debug) {
		loggers.push(
			createLogger(
				{
					received:
						process?.env?.NODESITE_EU_CORE_DEBUG_REC ||
						'nodesite.eu -> ',
					sent:
						process?.env?.NODESITE_EU_CORE_DEBUG_SENT ||
						'nodesite.eu <- ',
				},
				{},
				console.error
			)
		);
	}
	const socket = io(server || endpoint);
	if (loggers.length) {
		socket.onAny((event: string, ...args) =>
			loggers.forEach((logger) => logger.received(event, ...args))
		);
		const emit_real = socket.emit;
		Object.assign(socket, {
			emit: (event: string, ...args: any[]) => {
				emit_real.call(socket, event, ...args);

				loggers.forEach((logger) => logger.sent(event, ...args));

				return socket;
			},
		});
	}
	return socket;
}

export default connect;

declare const module: any;

if (typeof module === 'object') {
	Object.defineProperties(connect, {
		connect: { get: () => connect },
		default: { get: () => connect },
	});

	Object.assign(module, { exports: connect });
}

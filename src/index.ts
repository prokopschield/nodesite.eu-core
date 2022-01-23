import { createLogger, Logger } from '@lvksh/logger';
import { io } from 'socket.io-client';

export function connect(
	server?: string,
	...loggers: Logger<'received' | 'sent'>[]
) {
	if ((global || window)?.process?.env?.NODESITE_EU_CORE_DEBUG) {
		loggers.push(
			createLogger(
				{
					received:
						(global || window)?.process?.env
							?.NODESITE_EU_CORE_DEBUG_REC || 'nodesite.eu -> ',
					sent:
						(global || window)?.process?.env
							?.NODESITE_EU_CORE_DEBUG_SENT || 'nodesite.eu <- ',
				},
				{},
				console.error
			)
		);
	}
	const socket = io(server || `wss://nodesite.eu:20122`);
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

if (typeof module === 'object') {
	Object.defineProperties(connect, {
		connect: { get: () => connect },
		default: { get: () => connect },
	});
	Object.assign(module, { exports: connect });
}

import { io } from 'socket.io-client';

export = function connect(server?: string) {
	return io(server || `wss://nodesite.eu:20122`);
};

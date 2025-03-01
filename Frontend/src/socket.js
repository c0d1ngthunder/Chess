import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? 'https://chess-backend-p08w.onrender.com' : 'http://localhost:3000';

export const socket  = io(URL,{transports: ['websocket','polling']});

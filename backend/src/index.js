// start the Express app configured in src/app.js
const app = require('./app');

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// graceful shutdown
process.on('SIGINT', () => {
	console.log('SIGINT - shutting down');
	server.close(() => process.exit(0));
});
process.on('SIGTERM', () => {
	console.log('SIGTERM - shutting down');
	server.close(() => process.exit(0));
});
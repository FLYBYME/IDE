import { sseManager } from './src/canvas-llm-server/core/sse-manager';

async function run() {
    console.log('Sending broadcast...');
    sseManager.broadcast('debug.test', { hello: 'world' });
    console.log('Broadcast sent.');
}

run().catch(console.error);

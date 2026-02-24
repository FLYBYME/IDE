
import { HttpClient } from './src/canvas-llm-server/tui'; // Wait, I can't import IDESession directly if it's not exported.
// I'll just copy the HttpClient usage.

import { HttpClient as OriginalHttpClient } from 'tool-ms';

async function test() {
    const API_URL = 'http://localhost:3001';
    const client = new OriginalHttpClient(API_URL);
    console.log('Test: Calling client.load()...');
    try {
        await client.load();
        console.log('Test: client.load() success');
    } catch (err) {
        console.error('Test: client.load() failed:', err);
    }
    console.log('Test: Done');
}

test();

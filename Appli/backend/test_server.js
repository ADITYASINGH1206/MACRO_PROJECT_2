import fetch from 'node-fetch';
import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Starting backend server test...");
const serverProcess = fork(path.join(__dirname, 'server.js'), [], { silent: true });

serverProcess.stdout.on('data', async (data) => {
    const output = data.toString();
    console.log(`[Server] ${output.trim()}`);
    
    // Once server reports it's running, try fetching from it
    if (output.includes('running on port')) {
        try {
            console.log("Ping root endpoint -> http://localhost:5000/");
            const res = await fetch('http://localhost:5000/');
            const text = await res.text();
            console.log(`[Response] ${res.status}: ${text}`);
            
            if (res.status === 200) {
                console.log("✅ Backend connection test passed!");
            } else {
                console.log("❌ Test failed.");
            }
        } catch (err) {
            console.error("❌ Fetch failed:", err.message);
        } finally {
            serverProcess.kill();
            process.exit(0);
        }
    }
});

serverProcess.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    // Warnings (like missing env vars) should not kill the test
    if (msg.includes('⚠️') || msg.includes('warn')) {
        console.log(`[Server Warning] ${msg}`);
    } else {
        console.error(`[Server Error] ${msg}`);
        serverProcess.kill();
        process.exit(1);
    }
});

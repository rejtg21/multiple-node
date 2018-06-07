"use strict";
const ENV = require('node-env-file')(__dirname + '/.env');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const WorkerEntity = require('./worker.entity');
// how many cpu threads to be use
const thread = parseInt(ENV.THREAD) || numCPUs;

// console.log('number of cpus', numCPUs);
cluster.setupMaster({
    exec: './server.js'
});
// if (cluster.isMaster) {
console.log(`Master process id ${process.pid} is running`);

for (let i = 0; i < thread; i++) {
    spawnChild();
}

function spawnChild() {
    let worker = new WorkerEntity(cluster.fork());
    console.log('spawning a child');
    // worker.listen('fork', () => {
    //     console.log('fork  -- - -  - -');
    // });

    worker.listen('online', ()=> {

    });

    worker.listen('listening', ()=> {

    });

    worker.listen('disconnect', ()=> {
        // when the worker is disconnected
    });

    worker.listen('exit', ()=> {
        // when the worker is terminated respawn a child process.
        spawnChild();
    });
}

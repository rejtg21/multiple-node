
function WorkerEntity(worker) {
    if (!(this instanceof WorkerEntity))
        return new WorkerEntity(worker);
    this.worker = worker;
}

WorkerEntity.prototype = {
    listen,
    getProcessId
};

function listen(eventName, callback) {
    let processId = this.getProcessId();
    this.worker.on(eventName, (data1, data2, data3) => {
        console.log(`worker ${processId} status: ${eventName}`);
        callback(data1, data2, data3);
    });
}

function getProcessId() {
    return this.worker.process.pid;
}

module.exports = WorkerEntity;

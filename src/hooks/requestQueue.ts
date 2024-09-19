class RequestQueue {
    private queue: (() => Promise<any>)[] = [];
    private concurrency: number;
    private running: number = 0;
  
    constructor(concurrency: number = 3) {
      this.concurrency = concurrency;
    }
  
    enqueue(request: () => Promise<any>): Promise<any> {
      return new Promise((resolve, reject) => {
        this.queue.push(() => request().then(resolve).catch(reject));
        this.dequeue();
      });
    }
  
    private dequeue() {
      if (this.running >= this.concurrency) {
        return;
      }
  
      const request = this.queue.shift();
      if (!request) {
        return;
      }
  
      this.running++;
      request().finally(() => {
        this.running--;
        this.dequeue();
      });
    }
  }
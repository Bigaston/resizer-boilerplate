const Queue = require('bull');

const imageQueue = new Queue('image resize', process.env.REDIS_URL);
module.exports.imageQueue = imageQueue;

imageQueue.process((job, done) => {
  console.log(job);
});
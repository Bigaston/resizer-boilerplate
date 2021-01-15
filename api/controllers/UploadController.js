/**
 * UploadController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const imageQueue = require('../../operation/Resize').imageQueue;

module.exports = {
  create: async function (req, res) {
    if (req.body.name === undefined || req.body.name === '') {
      res.badRequest('No name');
      return;
    }

    req.file('image').upload({
      adapter: require('skipper-s3'),
      key: process.env.S3_KEY,
      secret: process.env.S3_SECRET,
      bucket: process.env.S3_BUCKET,
      maxBytes: 10000000,
      saveAs: (__newFileStream, next) => {
        return next(undefined, `/${process.env.S3_FOLDER}/${Date.now()}-${__newFileStream.filename}`);
      }
    }, function whenDone(err, uploadedFiles) {
      if (err) {
        res.serverError(err);
      }

      if (uploadedFiles.length === 0) {
        res.badRequest('No file was uploaded');
      }

      Image.create({
        name: req.body.name,
        path: uploadedFiles[0].fd,
        uploader: req.user.id
      }).fetch().then(img => {
        res.status(202).send(img.id);

        Operation.create({
          status: 'running',
          imageId: img.id
        }).then(ope => {
          imageQueue.add({ id: ope.id, img: uploadedFiles[0].fd });
        });
      });
    });
  },
  show: async function (req, res) {
    Image.find({ id: req.param('id') }).then(img => {
      if (!img) {
        return res.notFound();
      }

      img = img[0];

      var SkipperDisk = require('skipper-s3');
      var fileAdapter = SkipperDisk({
        key: process.env.S3_KEY,
        secret: process.env.S3_SECRET,
        bucket: process.env.S3_BUCKET,
      });

      res.set('Content-disposition', 'attachment; filename=\'' + img.path.split('/')[img.path.split('/').length - 1] + '\'');

      // Stream the file down
      fileAdapter.read(img.path)
        .on('error', (err) => {
          return res.serverError(err);
        })
        .pipe(res);
    });
  }
};


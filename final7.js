// M101J Final exam Q7
const mongoose = require("mongoose");
const async = require("async");
mongoose.connect("mongodb://localhost/final7");
const db = mongoose.connection;
db.once("open", function() {
  // we're connected!

  const albumSM = new mongoose.Schema({
    _id: Number,
    images: Array,
  });

  const imageSM = new mongoose.Schema({
    _id: Number,
    height: Number,
    width: Number,
    tags: Array,
  });

  const Album = mongoose.model("Albums", albumSM);
  const Image = mongoose.model("Image", imageSM);

  const orphans = [];
  const callbacks = [];
  // const q = Image.find({}).limit(2);
  const q = Image.find({});

  q.exec(function(e, image) {
    image.forEach(function(img) {
      callbacks.push(function(callback) {
        const q2 = Album.findOne({ images: img["_id"] });
        q2.exec(function(e, album) {
          if (album === null) {
            orphans.push(img["_id"]);
            const q3 = Image.remove({ _id: img["_id"] });
            q3.exec(function(e, r) {});
          }
          callback();
        });
      });
    });
    async.series(callbacks, function(e, r) {
      console.log(orphans);
      process.exit();
    });
  });
});

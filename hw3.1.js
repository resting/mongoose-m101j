// M101J HW 3.1
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/school");
const db = mongoose.connection;
db.once("open", function() {
  // we're connected!

  const schema = new mongoose.Schema({
    name: String,
    scores: [
      {
        type: String,
        score: Number
      }
    ]
  });

  const students = mongoose.model("students", schema);
  // grades.find({
  //   student_id: 0,
  //   score: 14.8504576811645
  // }).exec(function(e, d){
  //   console.log(d);
  // });

  const seen = new Map();

  let homework = [];
  let lowest = 100;
  db.db.collection("students", function(e, coll) {
    coll
      .find()
      .sort({
        student_id: 1
      })
      .toArray(function(e, d) {
        for (let i = 0; i < d.length; i++) {
          lowest = 100;
          for (let j = 0; j < d[i].scores.length; j++) {
            if (d[i].scores[j].type === "homework") {
              if (d[i].scores[j].score < lowest) {
                lowest = d[i].scores[j].score;
              }
            }
          }

          // Assume lowest is found is its not 100
          if (lowest !== 100) {
            console.log("removing _id:" + d[i]._id + " lowest: " + lowest);
            // Remove record from array
            coll.update(
              { _id: d[i]._id },
              { $pull: { scores: { type: "homework", score: lowest } } }
            );
          }
        }
      });
  });
});

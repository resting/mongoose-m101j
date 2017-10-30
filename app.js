// M101J HW 2.3
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/students');
const db = mongoose.connection;
db.once('open', function () {
  // we're connected!

  const schema = new mongoose.Schema({
    student_id: Number,
    type: String,
    score: Number,
  });

  const grades = mongoose.model('grades', schema);
  // grades.find({
  //   student_id: 0,
  //   score: 14.8504576811645
  // }).exec(function(e, d){
  //   console.log(d);
  // });

  const seen = new Map();

  let homework = [];
  let lowest = 100;
  db.db.collection('grades', function (e, coll) {
    coll.find({
      type: 'homework',
    }).sort({
      student_id: 1,
    }).toArray(function (e, d) {
      for (let i = 0; i < d.length; i++) {
        if (seen.size === 0) {
          seen.set(d[i].student_id, 1);
          homework.push(d[i].score);
          continue;
        }

        if (seen.get(d[i].student_id) === undefined) {
          if (homework.length !== 0) {
            for (let j = 0; j < homework.length; j++) {
              if (homework[j] < lowest) {
                lowest = homework[j];
              }
            }

            // Delete record
            grades.find({
              student_id: d[i - 1].student_id,
              type: 'homework',
              score: lowest
            }).remove().exec();
            console.log('removed: ', d[i - 1].student_id, lowest);

            lowest = 100;
            homework = [];
          }

          seen.set(d[i].student_id, 1);
          homework.push(d[i].score);
        } else {
          homework.push(d[i].score);
        }
      }
    });
  });
});
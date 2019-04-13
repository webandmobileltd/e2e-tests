const Constants = require("./Constants");

const generateToken = require('./generateToken');
const insertSubject = require('./insertSubject');
const insertVideo = require('./insertVideo');

const subjects = require('./fixture/subjects');
const instructionalVideos = require('./fixture/instructional_videos');
const stockVideos = require('./fixture/stock_videos');
const newsVideos = require('./fixture/news_videos');

async function insertVideos() {
  const token = await generateToken();
  return Promise.all(allVideos().map(video => insertVideo(video, token)));
}

async function insertSubjects() {
  const token = await generateToken();
  return Promise.all(subjects.map(subject => insertSubject(subject, token)));
}

function allVideos() {
  return [...instructionalVideos, ...stockVideos, ...newsVideos];
}

if (!Constants.TOKEN_URL || !Constants.OPERATOR_USERNAME || !Constants.OPERATOR_PASSWORD) {
  throw 'Environment variables not set properly.'
}

insertVideos()
  .then(() => {
    return insertSubjects()
  })
  .then(() => {
    console.log("Setup finished");
    process.exit();
  });

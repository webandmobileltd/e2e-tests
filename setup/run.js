const Constants = require('./Constants');

const generateToken = require('./generateToken');
const subjectsApi = require('./subjectApi');
const insertVideo = require('./videoApi');

const subjectFixtures = require('./fixture/subjects');
const instructionalVideos = require('./fixture/instructional_videos');
const stockVideos = require('./fixture/stock_videos');
const newsVideos = require('./fixture/news_videos');

async function insertVideos(token) {
  const videoPromises = await allVideos();

  return Promise.all(videoPromises.map(async (video) => {
    await insertVideo(video, token)
  }));
}

async function insertSubjects(token) {
  return Promise.all(subjectFixtures.map(subject => subjectsApi.insertSubject(subject, token)));
}

async function allVideos() {
  const allInterpolatedVideos = await instructionalVideos();

  return [...allInterpolatedVideos, ...stockVideos, ...newsVideos];
}

if (
  !Constants.TOKEN_URL ||
  !Constants.OPERATOR_USERNAME ||
  !Constants.OPERATOR_PASSWORD
) {
  throw 'Environment variables not set properly.';
}

let token = null;

// TODO Rewrite with async/await
generateToken()
  .then(returnedToken => {
    token = returnedToken;
  })
  .then(async () => {
    const subjects = await subjectsApi.getSubjects();

    if (!subjects) {
      await insertSubjects(token);
    } else {
      console.log('Subjects already exist, did not update subjects')
    }
  })
  .then(async () => {
    console.log('insert all videos');
    await insertVideos(token);
  })
  .then(() => {
    console.log('Setup finished');
    process.exit();
  });

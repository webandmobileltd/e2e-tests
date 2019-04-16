const video = require('./video');

module.exports = [
  video({
    provider: "Reuters",
    providerVideoId: "reuters-13",
    title: "Gdansk Mayor Stabbed at a charity event",
    description: "Terrible news from Poland",
    releasedOn: "2018-12-03T00:00:00",
    videoType: "NEWS"
  }),
  video({
    provider: "Reuters",
    providerVideoId: "reuters-14",
    title: "'Richard St. John: 8 secrets of success' goes viral on boclips",
    description:
      "Incredible news as the greatest video has exploded on the internet",
    releasedOn: "2018-12-04T00:00:00",
    videoType: "NEWS"
  }),
  video({
    provider: "Reuters",
    providerVideoId: "reuters-15",
    title: "Breaking news",
    description: "Latest piece of news about Richard",
    releasedOn: "2018-12-05T00:00:00",
    videoType: "NEWS"
  })
]

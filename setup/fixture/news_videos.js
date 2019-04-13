const video = require('./video');

module.exports = [
  video({
    provider: "Reuters",
    providerVideoId: "reuters-13",
    title: "Gdansk Mayor Stabbed at a charity event",
    description: "Terrible news from Poland",
    videoType: "NEWS"
  }),
  video({
    provider: "Reuters",
    providerVideoId: "reuters-14",
    title: "'Richard St. John: 8 secrets of success' goes viral on boclips",
    description:
      "Incredible news as the greatest video has exploded on the internet",
    videoType: "NEWS"
  })
]

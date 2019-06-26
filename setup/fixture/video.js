module.exports = function video(params) {
  return {
    provider: params.provider || "Minute Physics",
    providerVideoId: params.providerVideoId || "ted-123",
    title: params.title || "Richard St. John: 8 secrets of success",
    description: params.description || "Video description",
    releasedOn: params.releasedOn || "2018-12-04T00:00:00",
    // Duration always comes from the content provider. Therefore is not configurable in this fixture.
    // duration: params.duration || 'PT40M',
    legalRestrictions: "none",
    keywords: ["k1", "k2"],
    videoType: params.videoType || "INSTRUCTIONAL_CLIPS",
    playbackId: params.playbackId || "9eb02357-ed43-49ab-84c7-a0fa5699d860",
    playbackProvider: params.playbackProvider || "KALTURA",
    // Currently the subjects provided are not used in the video service. It's not possible to set the subject on a video
    // subjects: params.subjects || ["Maths"]
    ageRangeMin: params.ageRangeMin || null,
    ageRangeMax: params.ageRangeMax || null,
  };
}

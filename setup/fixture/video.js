module.exports = function video(params) {
  return {
    provider: params.provider || "Minute Physics",
    providerVideoId: params.providerVideoId || "ted-123",
    title: params.title || "Richard St. John: 8 secrets of success",
    description: params.description || "Video description",
    releasedOn: params.releasedOn || "2018-12-04T00:00:00",
    duration: 100,
    legalRestrictions: "none",
    keywords: ["k1", "k2"],
    videoType: params.videoType || "INSTRUCTIONAL_CLIPS",
    playbackId: params.playbackId || "9eb02357-ed43-49ab-84c7-a0fa5699d860",
    playbackProvider: params.playbackProvider || "KALTURA",
    subjects: params.subjects || ["Maths"]
  };
}

const fetch = require("node-fetch");

const videoServiceUrl = process.env.CYPRESS_VIDEOSERVICE_BASE_URL;

async function getToken() {
  const operatorUsername = process.env.CYPRESS_OPERATOR_USERNAME;
  const operatorPassword = process.env.CYPRESS_OPERATOR_PASSWORD;
  const response = await fetch(process.env.CYPRESS_TOKEN_URL, {
    method: "POST",
    body: `grant_type=password&client_id=admin-cli&username=${operatorUsername}&password=${operatorPassword}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  const body = await response.json();
  console.log("Generated user token");

  return body.access_token;
}

async function insertVideo(video, token) {
  console.log("Publish video:", video);

  return await fetch(videoServiceUrl + "/v1/videos", {
    method: "POST",
    body: JSON.stringify(video),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }).then(response => {
    console.log(
      `Video creation status:, ${response.statusText} ${response.status}`
    );
  });
}

async function insertSubject(subject, token) {
  return await fetch(videoServiceUrl + "/v1/subjects", {
    method: "POST",
    body: JSON.stringify(subject),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }).then(response => {
    console.log(
      `Subject creation status:, ${response.statusText} ${response.status}`
    );
  });
}

async function insertVideos() {
  const token = await getToken();
  return Promise.all(allVideos().map(video => insertVideo(video, token)));
}

async function insertSubjects() {
  const token = await getToken();
  return Promise.all(allSubjects().map(subject => insertSubject(subject, token)));
}

function allSubjects() {
  return [{name: "Mathematics"}, {name: "French"}, {name: "Biology"}, {name: "Art"}]
}

function allVideos() {
  const instructionalVideos = [
    video({
      providerVideoId: "ted-1",
      title: "Richard St. John: 8 secrets of success",
      description:
        "Why do people succeed? Is it because they\\'re smart? Or are they just lucky? Neither. Analyst Richard St. John condenses years of interviews into an unmissable 3-minute slideshow on the real secrets of success.",
      playbackId: "9eb02357-ed43-49ab-84c7-a0fa5699d860",
      subjects: ["Maths", "Physics"]
    }),
    video({
      providerVideoId: "Ac_t4pNYr1g",
      playbackProvider: "YOUTUBE",
      title: "The Terrifying art of Free Solo Slacklining UNTETHERED - Full Documentary",
      description:
        "The Terrifying art of Free Solo Slacklining UNTETHERED - Full Documentary",
      playbackId: "Ac_t4pNYr1g"
    }),
    video({
      providerVideoId: "ted-2",
      title: "Rives: If I controlled the Internet",
      description:
        "How many poets could cram eBay, Friendster and Monster.com into 3-minute poem worthy of a standing ovation? Enjoy Rives' unique talent."
    }),
    video({
      providerVideoId: "ted-3",
      title: 'Steven Johnson: How the "ghost map" helped end a killer disease',
      description:
        "Author Steven Johnson takes us on a 10-minute tour of The Ghost Map, his book about a cholera outbreak in 1854 London and the impact it had on science, cities and modern society."
    }),
    video({
      providerVideoId: "ted-4",
      title: "Jeff Han: The radical promise of the multi-touch interface",
      description:
        "Jeff Han shows off a cheap, scalable multi-touch and pressure-sensitive computer screen interface that may spell the end of point-and-click."
    }),
    video({
      providerVideoId: "ted-5",
      title: "Eva Vertes: Meet the future of cancer research",
      description:
        "Eva Vertes -- only 19 when she gave this talk -- discusses her journey toward studying medicine and her drive to understand the roots of cancer and Alzheimer’s."
    }),
    video({
      providerVideoId: "ted-6",
      title: "Mena Trott: Meet the founder of the blog revolution",
      description:
        "The founding mother of the blog revolution, Movable Type's Mena Trott, talks about the early days of blogging, when she realized that giving regular people the power to share our lives online is the key to building a friendlier, more connected world."
    }),
    video({
      providerVideoId: "ted-7",
      title: "Michael Shermer: Why people believe weird things",
      description:
        'Why do people see the Virgin Mary on a cheese sandwich or hear demonic lyrics in "Stairway to Heaven"? Using video and music, skeptic Michael Shermer shows how we convince ourselves to believe -- and overlook the facts.'
    }),
    video({
      providerVideoId: "ted-8",
      title: "Peter Gabriel: Fight injustice with raw video",
      description:
        "Musician and activist Peter Gabriel shares his very personal motivation for standing up for human rights with the watchdog group WITNESS -- and tells stories of citizen journalists in action."
    }),
    video({
      providerVideoId: "ted-9",
      title: "Seth Godin: How to get your ideas to spread",
      description:
        "In a world of too many options and too little time, our obvious choice is to just ignore the ordinary stuff. Marketing guru Seth Godin spells out why, when it comes to getting our attention, bad or bizarre ideas are more successful than boring ones."
    }),
    video({
      providerVideoId: "ted-10",
      title: "Vik Muniz: Art with wire, sugar, chocolate and string",
      description:
        "Vik Muniz makes art from pretty much anything, be it shredded paper, wire, clouds or diamonds. Here he describes the thinking behind his work and takes us on a tour of his incredible images."
    }),
    video({
      providerVideoId: "ted-11",
      title: "Robert Neuwirth: The hidden world of shadow cities",
      description:
        'Robert Neuwirth, author of "Shadow Cities," finds the worlds squatter sites -- where a billion people now make their homes -- to be thriving centers of ingenuity and innovation. He takes us on a tour.'
    })
  ];
  const stockVideos = [
    video({
      provider: "Getty",
      providerVideoId: "getty-12",
      videoType: "STOCK",
      title: "Celebrities on the red carpet",
      description: "Not valuable for education"
    })
  ];
  const newsVideos = [
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
  ];
  return [...instructionalVideos, ...stockVideos, ...newsVideos];
}

function video(params) {
  return {
    provider: params.provider || "TED Talks",
    providerVideoId: params.providerVideoId || "ted-123",
    title: params.title || "Richard St. John: 8 secrets of success",
    description: params.description || "Video description",
    releasedOn: "2018-12-04T00:00:00",
    duration: 100,
    legalRestrictions: "none",
    keywords: ["k1", "k2"],
    videoType: params.videoType || "INSTRUCTIONAL_CLIPS",
    playbackId: params.playbackId || "9eb02357-ed43-49ab-84c7-a0fa5699d860",
    playbackProvider: params.playbackProvider || "KALTURA",
    subjects: params.subjects || ["Maths"]
  };
}

insertVideos()
  .then(() => {
    return insertSubjects()
  })
  .then(() => {
    console.log("Setup finished");
    process.exit();
  });

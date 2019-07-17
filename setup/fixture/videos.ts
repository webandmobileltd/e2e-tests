import { getSubjects } from '../subjectApi';

export interface VideoFixture {
  provider: string;
  providerVideoId: string;
  title: string;
  description: string;
  releasedOn: string;
  legalRestrictions: string;
  keywords: string[];
  videoType: string;
  playbackId: string;
  playbackProvider: string;
  subjects?: string[];
  duration?: string;
  ageRangeMin?: number;
  ageRangeMax?: number;
}

function video(params: Partial<VideoFixture>): VideoFixture {
  return {
    provider: params.provider || 'Minute Physics',
    providerVideoId: params.providerVideoId || 'ted-123',
    title: params.title || 'Richard St. John: 8 secrets of success',
    description: params.description || 'Video description',
    releasedOn: params.releasedOn || '2018-12-04T00:00:00',
    legalRestrictions: 'none',
    keywords: ['k1', 'k2'],
    videoType: params.videoType || 'INSTRUCTIONAL_CLIPS',
    playbackId: params.playbackId || '9eb02357-ed43-49ab-84c7-a0fa5699d860',
    playbackProvider: params.playbackProvider || 'KALTURA',
    subjects: params.subjects || undefined,
    ageRangeMin: params.ageRangeMin || undefined,
    ageRangeMax: params.ageRangeMax || undefined,
  };
}

export async function getInstructionalVideoFixtures(): Promise<VideoFixture[]> {
  const subjects = await getSubjects();

  function convertToId(subjectName: string) {
    if (subjects === undefined) {
      throw new Error('Subjects are undefined');
    }

    const matchingSubjects = subjects.filter(s => s.name === subjectName);

    if (matchingSubjects.length === 0) {
      throw Error('Matched no subject, check fixtures.');
    }
    if (matchingSubjects.length > 1) {
      throw Error('Matched more than one subject, check fixtures.');
    }

    return matchingSubjects[0].id;
  }

  return [
    video({
      providerVideoId: 'minute-physics-1',
      title: 'Richard St. John: 8 secrets of success',
      description:
        "Why do people succeed? Is it because they\\'re smart? Or are they just lucky? Neither. Analyst Richard St. John condenses years of interviews into an unmissable 3-minute slideshow on the real secrets of success.",
      playbackId: '9eb02357-ed43-49ab-84c7-a0fa5699d860',
      subjects: [convertToId('Mathematics'), convertToId('Physics')],
    }),
    video({
      providerVideoId: 's3Gl6T0CC2I',
      playbackProvider: 'YOUTUBE',
      title:
        'The Terrifying art of Free Solo Slacklining UNTETHERED - Full Documentary',
      description: 'This is now about dogs.',
      playbackId: 's3Gl6T0CC2I',
      subjects: [convertToId('Biology'), convertToId('Physics')],
      duration: 'PT1M30S',
      ageRangeMin: 4,
      ageRangeMax: 8,
    }),
    video({
      providerVideoId: 'minute-physics-2',
      title: 'Rives: If I controlled the Internet',
      description:
        "How many poets could cram eBay, Friendster and Monster.com into 3-minute poem worthy of a standing ovation? Enjoy Rives' unique talent.",
      subjects: [convertToId('Biology'), convertToId('Physics')],
      playbackId: 'b6d3a962-a013-4fff-9cc2-0ef7ee7a7afe',
      duration: 'PT1M30S',
      ageRangeMin: 10,
      ageRangeMax: 13,
    }),
    video({
      providerVideoId: 'minute-physics-3',
      title: 'Steven Johnson: How the "ghost map" helped end a killer disease',
      description:
        'Author Steven Johnson takes us on a 10-minute tour of The Ghost Map, his book about a cholera outbreak in 1854 London and the impact it had on science, cities and modern society.',
      subjects: [convertToId('Biology'), convertToId('Physics')],
      duration: 'PT5M30S',
      playbackId: 'b6d3a962-a013-4fff-9cc2-0ef7ee7a7afe',
      ageRangeMin: 4,
      ageRangeMax: 10,
    }),
    video({
      providerVideoId: 'minute-physics-4',
      title: 'Jeff Han: The radical promise of the multi-touch interface',
      description:
        'Jeff Han shows off a cheap, scalable multi-touch and pressure-sensitive computer screen interface that may spell the end of point-and-click.',
      subjects: [convertToId('Mathematics'), convertToId('Physics')],
      playbackId: 'b6d3a962-a013-4fff-9cc2-0ef7ee7a7afe',
      duration: 'PT1M30S',
      ageRangeMin: 4,
      ageRangeMax: 10,
    }),
    video({
      providerVideoId: 'minute-physics-5',
      title: 'Eva Vertes: Meet the future of cancer research',
      description:
        'Eva Vertes -- only 19 when she gave this talk -- discusses her journey toward studying medicine and her drive to understand the roots of cancer and Alzheimer’s.',
    }),
    video({
      providerVideoId: 'minute-physics-6',
      title: 'Mena Trott: Meet the founder of the blog revolution',
      description:
        "The founding mother of the blog revolution, Movable Type's Mena Trott, talks about the early days of blogging, when she realized that giving regular people the power to share our lives online is the key to building a friendlier, more connecminute-physics world.",
    }),
    video({
      providerVideoId: 'minute-physics-7',
      title: 'Michael Shermer: Why people believe weird things',
      description:
        'Why do people see the Virgin Mary on a cheese sandwich or hear demonic lyrics in "Stairway to Heaven"? Using video and music, skeptic Michael Shermer shows how we convince ourselves to believe -- and overlook the facts.',
    }),
    video({
      providerVideoId: 'minute-physics-8',
      title: 'Peter Gabriel: Fight injustice with raw video',
      description:
        'Musician and activist Peter Gabriel shares his very personal motivation for standing up for human rights with the watchdog group WITNESS -- and tells stories of citizen journalists in action.',
    }),
    video({
      providerVideoId: 'minute-physics-9',
      title: 'Seth Godin: How to get your ideas to spread',
      description:
        'In a world of too many options and too little time, our obvious choice is to just ignore the ordinary stuff. Marketing guru Seth Godin spells out why, when it comes to getting our attention, bad or bizarre ideas are more successful than boring ones.',
    }),
    video({
      providerVideoId: 'minute-physics-10',
      title: 'Vik Muniz: Art with wire, sugar, chocolate and string',
      description:
        'Vik Muniz makes art from pretty much anything, be it shredded paper, wire, clouds or diamonds. Here he describes the thinking behind his work and takes us on a tour of his incredible images.',
    }),
    video({
      providerVideoId: 'minute-physics-11',
      title: 'Robert Neuwirth: The hidden world of shadow cities',
      description:
        'Robert Neuwirth, author of "Shadow Cities," finds the worlds squatter sites -- where a billion people now make their homes -- to be thriving centers of ingenuity and innovation. He takes us on a tour.',
    }),
  ];
}

export const newsVideoFixtures: VideoFixture[] = [
  video({
    provider: 'Reuters',
    providerVideoId: 'reuters-13',
    title: 'Gdansk Mayor Stabbed at a charity event',
    description: 'Terrible news from Poland',
    releasedOn: '2018-12-03T00:00:00',
    videoType: 'NEWS',
  }),
  video({
    provider: 'Reuters',
    providerVideoId: 'reuters-14',
    title: "'Richard St. John: 8 secrets of success' goes viral on boclips",
    description:
      'Incredible news as the greatest video has exploded on the internet',
    releasedOn: '2018-12-04T00:00:00',
    videoType: 'NEWS',
  }),
  video({
    provider: 'Reuters',
    providerVideoId: 'reuters-15',
    title: 'Breaking news',
    description: 'Latest piece of news about Richard',
    releasedOn: '2018-12-05T00:00:00',
    videoType: 'NEWS',
  }),
];

export const stockVideoFixtures: VideoFixture[] = [
  video({
    provider: 'Getty',
    providerVideoId: 'getty-12',
    videoType: 'STOCK',
    title: 'Celebrities on the red carpet',
    description: 'Not valuable for education',
  }),
];

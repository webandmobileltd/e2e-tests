export interface DisciplineFixture {
  name: string;
  code: string;
  associatedSubject: string;
}

export const disciplineFixtures: DisciplineFixture[] = [
  {
    name: 'Big discipline',
    code: 'big-discipline',
    associatedSubject: 'Biology',
  },
];

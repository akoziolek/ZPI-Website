import prisma from '../lib/db.js'

const ROLES = Object.freeze({
  KPK_MEMBER: 'KPK_MEMBER',
  TEAM_LEADER: 'TEAM_LEADER',
  TEACHING_SUPERVISOR: 'TEACHING_SUPERVISOR',
  STUDENTS_SUPERVISOR: 'STUDENTS_SUPERVISOR',
  STUDENT: 'STUDENT'
});

const ROLES_LABELS = Object.freeze({
  [ROLES.KPK_MEMBER]: 'Członek KPK',
  [ROLES.TEAM_LEADER]: 'Opiekun zespołu',
  [ROLES.TEACHING_SUPERVISOR]: 'Opiekun dydaktyki',
  [ROLES.STUDENTS_SUPERVISOR]: 'Opiekun studentów',
  [ROLES.STUDENT]: 'Student',
});

const STATUS = Object.freeze({
  OPEN: 'OPEN',
  PREPARING: 'PREPARING',
  SUBMITTED: 'SUBMITTED',
  REJECTED: 'REJECTED',
  APPROVED: 'APPROVED',
});

const STATUS_LABELS = Object.freeze({
  [STATUS.OPEN]: 'Otwarty',
  [STATUS.PREPARING]: 'W przygotowaniu do złożenia wniosku',
  [STATUS.SUBMITTED]: 'Złożony',
  [STATUS.REJECTED]: 'Odrzucony',
  [STATUS.APPROVED]: 'Zatwierdzony',
});

const DECLARATION_STATUSES = new Set([
  STATUS.PREPARING,
  STATUS.SUBMITTED,
  STATUS.APPROVED,
  STATUS.REJECTED,
]);

const SIGNATURE_STATUSES = new Set([
  STATUS.SUBMITTED,
  STATUS.APPROVED,
  STATUS.REJECTED,
]);

const STUDENTS_DATA = [
  { name: 'Anna', surname: 'Nowak', index: '234567', ects: 5 },
  { name: 'Piotr', surname: 'Zieliński', index: '345678', ects: 0 },
  { name: 'Katarzyna', surname: 'Wójcik', index: '456789', ects: 0 },
  { name: 'Krzysztof', surname: 'Kowalczyk', index: '567890', ects: 10 },
  { name: 'Magdalena', surname: 'Lewandowska', index: '678901', ects: 0 },
  { name: 'Tomasz', surname: 'Kaczmarek', index: '789012', ects: 0 },
  { name: 'Natalia', surname: 'Mazur', index: '890123', ects: 0 },
  { name: 'Michał', surname: 'Jankowski', index: '901234', ects: 0 },
  { name: 'Ewa', surname: 'Wasiak', index: '012345', ects: 0 },
  { name: 'Paweł', surname: 'Górski', index: '123459', ects: 0 },
  { name: 'Joanna', surname: 'Szymańska', index: '234560', ects: 0 },
  { name: 'Bartosz', surname: 'Woźniak', index: '345670', ects: 0 },
  { name: 'Alicja', surname: 'Dąbrowska', index: '456780', ects: 0 },
  { name: 'Rafał', surname: 'Piotrowski', index: '567895', ects: 0 },
  { name: 'Monika', surname: 'Grabowska', index: '678909', ects: 0 },
  { name: 'Filip', surname: 'Zając', index: '789019', ects: 0 },
  { name: 'Weronika', surname: 'Krawczyk', index: '890129', ects: 0 },
  { name: 'Marek', surname: 'Czarnecki', index: '901239', ects: 0 },
  { name: 'Dominika', surname: 'Król', index: '012349', ects: 0 },
  { name: 'Jakub', surname: 'Lis', index: '123460', ects: 0 },
  { name: 'Laura', surname: 'Sikora', index: '234570', ects: 0 },
];

const TEAM_LEADERS_DATA = [
  { name: 'Marcin', surname: 'Nowicki' },
  { name: 'Alicja', surname: 'Kozłowska' },
  { name: 'Kacper', surname: 'Witkowski' },
  { name: 'Natalia', surname: 'Michalska' },
  { name: 'Jakub', surname: 'Zalewski' },
];

const TEACHING_SUPERVISORS_DATA = [
  { name: 'Weronika', surname: 'Duda' },
  { name: 'Krzysztof', surname: 'Wójtowicz' },
  { name: 'Patrycja', surname: 'Kalinowska' },
];

const STUDENTS_SUPERVISORS_DATA = [
  { name: 'Radosław', surname: 'Sokołowski' },
  { name: 'Magdalena', surname: 'Głowacka' },
];

const KPK_MEMBER_DATA = [
  { name: 'Alicja', surname: 'Kot' },
  { name: 'Adam', surname: 'Kot' },
];

const TOPICS_TO_GENERATE = [
  {
    name: 'Wpływ AI na procesy rekrutacyjne',
    status: STATUS.OPEN,
    studentCount: 0,
  },
  {
    name: 'Architektura mikroserwisów w chmurze',
    status: STATUS.PREPARING, 
    studentCount: 3,
  },
  {
    name: 'Modelowanie danych w NoSQL',
    status: STATUS.SUBMITTED,
    studentCount: 4,
  },
  {
    name: 'Machine Learning dla detekcji oszustw',
    status: STATUS.APPROVED,
    studentCount: 5,
    opinion: ''
  },
  {
    name: 'Zastosowanie blockchain w logistyce',
    status: STATUS.REJECTED,
    studentCount: 3,
    opinion: 'Temat jest nieaktualny i zbyt teoretyczny. Wymaga modernizacji.'
  }
];

const createEmail = (name, surname) =>
  `${name.toLowerCase()}.${surname.toLowerCase()}@pwr.edu.pl`;

async function seedByKeyMap(valuesMap, upsertFunction) {
  const mappedDbEntries = await Promise.all(
    Object.entries(valuesMap).map(async ([key, value]) => {
      const row = await upsertFunction(value);
      return [key, row];
    })
  );
  return Object.fromEntries(mappedDbEntries);
}


async function main() {
  console.log('Seeding started...');
  console.log('1. Seeding Roles...');

  const seededRoles = await seedByKeyMap(ROLES_LABELS, (role_name) =>
    prisma.role.upsert({
      where: { role_name },
      update: {},
      create: { role_name },
    })
  );

  console.log('Seeded %d roles', Object.keys(seededRoles).length);
  console.log('\n2. Seeding statuses...');

  const seededStatuses = await seedByKeyMap(STATUS_LABELS, (status_name) =>
    prisma.status.upsert({
      where: { status_name },
      update: {},
      create: { status_name },
    })
  );

  console.log('Seeded %d statuses', Object.keys(seededStatuses).length);

  // czy usuwamy ?, czy tak jak wczesniej z upsert
  await prisma.$transaction([
    prisma.opinion.deleteMany(),
    prisma.signature.deleteMany(),
    prisma.student.deleteMany(),
    prisma.topic.deleteMany(),
    prisma.declaration.deleteMany(),
    prisma.academicEmployee.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('\n3. Seeding students...');

  const seededStudents = [];
  for (const data of STUDENTS_DATA) {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        surname: data.surname,
        mail: createEmail(data.name, data.surname),
        role_id: seededRoles.STUDENT.role_id,
      },
    });

    await prisma.student.create({
      data: {
        index: data.index,
        ects_deficit: data.ects,
        user: { connect: { user_id: user.user_id } }
      },
    });
    seededStudents.push(user);
  }
    
  const studentsPool = [...seededStudents];
  const getStudents = (count) => studentsPool.splice(0, count);

  console.log('Seeded %d students', seededStudents.length);
  console.log('\n4. Seeding other users...');

  async function seedWorkersByRole(userDataArray, roleKey) {
    const roleId = seededRoles[roleKey].role_id;
    const seededUsers = [];

    for (let i = 0; i < userDataArray.length; i++) {
      const data = userDataArray[i];

      const uniqueMail = createEmail(data.name, data.surname).replace('@', `${i + 1}@`);

      const user = await prisma.user.create({
        data: {
          name: data.name,
          surname: data.surname,
          mail: uniqueMail,
          role_id: roleId,
        },
      });

      await prisma.academicEmployee.create({
        data: {
          user: { connect: { user_id: user.user_id } }
        }
      })
      seededUsers.push(user);
    }

    console.log('Seeded %d %s', seededUsers.length, seededRoles[roleKey].role_name);
    return seededUsers;
  }

  const teamLeaders = await seedWorkersByRole(TEAM_LEADERS_DATA, ROLES.TEAM_LEADER);
  const teachingSupervisors = await seedWorkersByRole(TEACHING_SUPERVISORS_DATA, ROLES.TEACHING_SUPERVISOR);
  const studentsSupervisors = await seedWorkersByRole(STUDENTS_SUPERVISORS_DATA, ROLES.STUDENTS_SUPERVISOR);
  const kpkMembers = await seedWorkersByRole(KPK_MEMBER_DATA, ROLES.KPK_MEMBER);
  const teamLeadersPool = [...teamLeaders];
  const getTeamLeader = () => teamLeadersPool.shift();

  console.log('\n5. Seeding different Topics...');

  const seededTopics = []
  for (const config of TOPICS_TO_GENERATE) {
    const students = getStudents(config.studentCount);
    const leader = config.status !== STATUS.OPEN ? getTeamLeader() : null;
    const needsDeclaration = DECLARATION_STATUSES.has(config.status);
    const needsSignatures = SIGNATURE_STATUSES.has(config.status);

    const topic = await prisma.topic.create({
      data: {
        name: config.name,
        description: `${config.name}`,
        status: { connect: { status_id: seededStatuses[config.status].status_id } },
        ...(leader && { employee: { connect: { user_id: leader.user_id } } }),
        
        students: { connect: students.map(s => ({ user_id: s.user_id })) },

        ...(needsDeclaration && {
          declaration: {
            create: {
              ...(needsSignatures && {
                signatures: {
                  create: [leader, ...students]
                    .filter(Boolean)
                    .map(u => ({ user: { connect: { user_id: u.user_id } } }))
                }
              })
            }
          }
        }),

        ...(config.opinion && {
          opinion: {
            create: {
              argumentation: config.opinion,
              employee: { connect: { user_id: kpkMembers[0].user_id } } 
            }
          }
        })
      }
    });
    seededTopics.push(topic);
  }

    console.log('Seeded %d topics', seededTopics.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
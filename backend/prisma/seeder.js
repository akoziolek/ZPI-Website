import { use } from 'react';
import prisma from '../lib/db.js'
import { connect } from 'http2';

const ROLES_TO_SEED = [
  { js_key: 'KPK_MEMBER', role_name: 'Członek KPK' },
  { js_key: 'TEAM_LEADER', role_name: 'Opiekun zespołu' },
  { js_key: 'TEACHING_SUPERVISOR', role_name: 'Opiekun dydaktyki' },
  { js_key: 'STUDENTS_SUPERVISOR', role_name: 'Opiekun studentów' },
  { js_key: 'STUDENT', role_name: 'Student' },
];

const STATUSES_TO_SEED = [
  { js_key: 'OPEN', status_name: 'Otwarty' },
  { js_key: 'PREPARING', status_name: 'W przygotowaniu do złożenia wniosku' },
  { js_key: 'SUBMITTED', status_name: 'Złożony' },
  { js_key: 'REJECTED', status_name: 'Odrzucony' },
  { js_key: 'APPROVED', status_name: 'Zatwierdzony' },
];

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

const createEmail = (name, surname) =>
  `${name.toLowerCase()}.${surname.toLowerCase()}@pwr.edu.pl`;

async function main() {
  console.log('Seeding started...');

  console.log('1. Seeding Roles...');
  const seededRoles = {};

  for (const role of ROLES_TO_SEED) {
    const upsertedRole = await prisma.role.upsert({
      where: { role_name: role.role_name },
      update: {},
      create: { role_name: role.role_name },
    });

    seededRoles[role.js_key] = upsertedRole;
  }

  console.log('Seeded %d roles', Object.keys(seededRoles).length);

  console.log('\n2. Seeding statuses...');
  const seededStatuses = {};

  for (const status of STATUSES_TO_SEED) {
    const upsertedStatus = await prisma.status.upsert({
      where: { status_name: status.status_name },
      update: {},
      create: { status_name: status.status_name },
    });
    seededStatuses[status.js_key] = upsertedStatus;
  }

  console.log('Seeded %d statuses', Object.keys(seededStatuses).length);

  // czy usuwamy ?, czy tak jak wczesniej z upsert
  await prisma.student.deleteMany();
  await prisma.opinion.deleteMany();
  await prisma.signature.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.declaration.deleteMany();
  await prisma.academicEmployee.deleteMany();
  await prisma.user.deleteMany();

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

    const student = await prisma.student.create({
      data: {
        index: data.index,
        ects_deficit: data.ects,
        user: { connect: { user_id: user.user_id } }
      },
    });
    seededStudents.push(user);
  }

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

      const worker = await prisma.academicEmployee.create({
        data: {
          user: { connect: { user_id: user.user_id } }
        }
      })
      seededUsers.push(user);
    }

    console.log('Seeded %d %s', seededUsers.length, seededRoles[roleKey].role_name);
    return seededUsers;
  }

  const teamLeaders = await seedWorkersByRole(TEAM_LEADERS_DATA, 'TEAM_LEADER');
  const teachingSupervisors = await seedWorkersByRole(TEACHING_SUPERVISORS_DATA, 'TEACHING_SUPERVISOR');
  const studentsSupervisors = await seedWorkersByRole(STUDENTS_SUPERVISORS_DATA, 'STUDENTS_SUPERVISOR');
  const kpkMembers = await seedWorkersByRole(KPK_MEMBER_DATA, 'KPK_MEMBER');
  const seededTopics = []

  console.log('\n5. Seeding different Topics...');

  // open topic, without students, declarations, leader
  const topicA = await prisma.topic.create({
    data: {
      name: 'Wpływ AI na procesy rekrutacyjne',
      description: 'Analiza wykorzystania sztucznej inteligencji...',
      status: {
        connect: {
          status_id: seededStatuses.OPEN.status_id
        }
      }
    },
  });
  seededTopics.push(topicA);

  // In preparation topic, with a declaration, students, leader, but no signatures
  const studentsToConnect = seededStudents.slice(0, 3);
  const teamLeader = teamLeaders[0];

  const topicB = await prisma.topic.create({
    data: {
      name: 'Architektura mikroserwisów w chmurze (Zespołowy)',
      description: 'Projekt i implementacja aplikacji opartej na mikroserwisach...',
      status: { connect: { status_id: seededStatuses.PREPARING.status_id } },
      employee: { connect: { user_id: teamLeader.user_id } },
      declaration: { create: {} },
      students: { connect: studentsToConnect.map(s => ({ user_id: s.user_id })) }
    },
    include: { declaration: true }
  });

  seededTopics.push(topicB);

  // submitted with signatures
  const studentsToConnect2 = seededStudents.slice(4, 8);
  const topicC = await prisma.topic.create({
    data: {
      name: 'Modelowanie danych w NoSQL',
      description: 'Badanie wydajności baz danych NoSQL...',
      status: { connect: { status_id: seededStatuses.SUBMITTED.status_id } },
      employee: { connect: { user_id: teamLeaders[0].user_id } },
      declaration: { create: {} },
      students: { connect: studentsToConnect2.map(s => ({ user_id: s.user_id })) }
    },
    include: { declaration: true }
  });

  await prisma.signature.createMany({
    data: [teamLeader, ...studentsToConnect2].map(user => ({
      user_id: user.user_id,
      declaration_id: topicC.declaration.declaration_id,
    }))
  });

  seededTopics.push(topicC);

  // rejected
  const studentsToConnect3 = seededStudents.slice(8, 10);
  const teamLeader1 = teamLeaders[1];

  const topicD = await prisma.topic.create({
    data: {
      name: 'Zastosowanie blockchain w logistyce',
      description: 'Koncepcja i analiza technologii rozproszonego rejestru...',
      status: { connect: { status_id: seededStatuses.REJECTED.status_id } },
      employee: { connect: { user_id: teamLeader1.user_id } },
      declaration: { create: {} },
      students: {
        connect: studentsToConnect3.map(s => ({ user_id: s.user_id }))
      }
    },
    include: { declaration: true }
  });

  await prisma.signature.createMany({
    data: [teamLeader1, ...studentsToConnect3].map(u => ({
      user_id: u.user_id,
      declaration_id: topicD.declaration.declaration_id,
    }))
  });

  await prisma.opinion.create({
    data: {
      argumentation: 'Temat jest nieaktualny i zbyt teoretyczny. Wymaga modernizacji.',
      employee_id: kpkMembers[0].user_id,
      topic_id: topicD.topic_id,
    }
  });

  seededTopics.push(topicD);

  // approved
  const studentsToConnect4 = seededStudents.slice(10, 15);

  const topicE = await prisma.topic.create({
    data: {
      name: 'Machine Learning dla detekcji oszustw',
      description: 'Implementacja algorytmów uczenia maszynowego...',
      status: { connect: { status_id: seededStatuses.APPROVED.status_id } },
      employee: { connect: { user_id: teamLeader1.user_id } },
      declaration: { create: {} },
      students: {
        connect: studentsToConnect4.map(s => ({ user_id: s.user_id }))
      }
    },
    include: { declaration: true }
  });

  await prisma.signature.createMany({
    data: [teamLeader1, ...studentsToConnect4].map(u => ({
      user_id: u.user_id,
      declaration_id: topicE.declaration.declaration_id,
    }))
  });

  await prisma.opinion.create({
    data: {
      argumentation: '',
      employee_id: kpkMembers[1].user_id,
      topic_id: topicE.topic_id,
    }
  });

  seededTopics.push(topicE);

  console.log('Seeded %d topics', seededTopics.length);

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Błąd podczas seedowania:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

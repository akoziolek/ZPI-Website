import prisma from '../src/lib/db.js'

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
  { name: 'Anna', surname: 'Sider', index: '204570', ects: 2 },

  { name: 'Ola', surname: 'Kot', index: '232323', ects: 0},
  { name: 'Olga', surname: 'Grzyb', index: '12242', ects: 0},
  { name: 'Tomasz', surname: 'Nowy', index: '239123', ects: 4},
  { name: 'Łukasz', surname: 'Szybki', index: '252003', ects: 0},
  { name: 'Ignacy', surname: 'Maj', index: '212423', ects: 0},
  { name: 'Tomasz', surname: 'Nowy', index: '239823', ects: 4 },
  { name: 'Łukasz', surname: 'Szybki', index: '252023', ects: 0 },
  { name: 'Ignacy', surname: 'Maj', index: '212323', ects: 0 },
  { name: 'Karolina', surname: 'Pawlak', index: '323456', ects: 0 },
  { name: 'Mateusz', surname: 'Michalski', index: '334567', ects: 0 },
  { name: 'Patrycja', surname: 'Kubiak', index: '345678', ects: 0 },
  { name: 'Adrian', surname: 'Bąk', index: '356789', ects: 0 },
  { name: 'Julia', surname: 'Ostrowska', index: '367890', ects: 0 },
  { name: 'Szymon', surname: 'Urbański', index: '378901', ects: 0 },
  { name: 'Paulina', surname: 'Cieślak', index: '389012', ects: 0 },
  { name: 'Damian', surname: 'Kruk', index: '390123', ects: 0 },
  { name: 'Sandra', surname: 'Bednarek', index: '401234', ects: 0 },
  { name: 'Kamil', surname: 'Tomczak', index: '412345', ects: 0 },
  { name: 'Sebastian', surname: 'Kubiak', index: '423456', ects: 0 },
  { name: 'Martyna', surname: 'Sadowska', index: '434567', ects: 0 },
  { name: 'Dawid', surname: 'Kamiński', index: '445678', ects: 0 },
  { name: 'Paulina', surname: 'Rutkowska', index: '456781', ects: 0 },
  { name: 'Norbert', surname: 'Kołodziej', index: '467892', ects: 0 },
  { name: 'Karol', surname: 'Szczepański', index: '478903', ects: 0 },
  { name: 'Iga', surname: 'Piasecka', index: '489014', ects: 0 },
  { name: 'Marcin', surname: 'Borowski', index: '490125', ects: 0 },
  { name: 'Aleksandra', surname: 'Kowal', index: '501236', ects: 0 },
  { name: 'Łukasz', surname: 'Domański', index: '512347', ects: 0 },
  { name: 'Emilia', surname: 'Makowska', index: '523458', ects: 0 },
  { name: 'Patryk', surname: 'Witkowski', index: '534569', ects: 0 },
  { name: 'Natalia', surname: 'Kurek', index: '545670', ects: 0 },
  { name: 'Oskar', surname: 'Pietrzak', index: '556781', ects: 0 },
  { name: 'Zuzanna', surname: 'Błaszczyk', index: '567892', ects: 0 },
  { name: 'Kacper', surname: 'Kalinowski', index: '578903', ects: 0 },
  { name: 'Milena', surname: 'Polańska', index: '589014', ects: 0 },
  { name: 'Hubert', surname: 'Szulc', index: '590125', ects: 0 },
  { name: 'Wiktoria', surname: 'Kaczor', index: '601236', ects: 0 },
  { name: 'Artur', surname: 'Zawadzki', index: '612347', ects: 0 },
];

const TEAM_LEADERS_DATA = [
  { name: 'Marcin', surname: 'Nowicki' },
  { name: 'Alicja', surname: 'Kozłowska' },
  { name: 'Kacper', surname: 'Witkowski' },
  { name: 'Natalia', surname: 'Michalska' },
  { name: 'Jakub', surname: 'Zalewski' },
  { name: 'Michał', surname: 'Kowalski' },
  { name: 'Janusz', surname: 'Drzewo' },
  { name: 'Piotr', surname: 'Jastrzębski' },
  { name: 'Łukasz', surname: 'Kowalski' },
  { name: 'Radosław', surname: 'Sowa' },
  { name: 'Maciej', surname: 'Łódź' },
  { name: 'Kuba', surname: 'Jarzębski' },
  { name: 'Maria', surname: 'Kowalska' },

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
  { name: 'Amelia', surname: 'Kot' },
  { name: 'Artur', surname: 'Kot' },
];

const TOPICS_TO_GENERATE = [
  {
    name: 'Wpływ AI na procesy rekrutacyjne',
    description: 'Analiza wykorzystania algorytmów uczenia maszynowego w automatyzacji selekcji CV oraz ocenie kompetencji miękkich kandydatów podczas rozmów rekrutacyjnych.',
    status: STATUS.OPEN,
    studentCount: 0,
  },
  {
    name: 'Architektura mikroserwisów w chmurze',
    description: 'Projekt i implementacja skalowalnego systemu opartego na mikroserwisach z wykorzystaniem technologii Docker i Kubernetes w środowisku chmury obliczeniowej.',
    status: STATUS.PREPARING, 
    studentCount: 3,
  },
  {
    name: 'Modelowanie danych w NoSQL',
    description: 'Badanie wydajności oraz struktur przechowywania danych w bazach dokumentowych i grafowych w porównaniu do tradycyjnych relacyjnych baz danych.',
    status: STATUS.SUBMITTED,
    studentCount: 4,
  },
  {
    name: 'Machine Learning dla detekcji oszustw',
    description: 'Opracowanie modelu klasyfikacyjnego wykrywającego anomalie w transakcjach finansowych w czasie rzeczywistym, mającego na celu zapobieganie nadużyciom kart płatniczych.',
    status: STATUS.APPROVED,
    studentCount: 5,
    opinion: ' '
  },
  {
    name: 'Zastosowanie blockchain w logistyce',
    description: 'Wykorzystanie technologii rozproszonych rejestrów (DLT) do zwiększenia przejrzystości łańcucha dostaw oraz automatyzacji płatności poprzez inteligentne kontrakty (Smart Contracts).',
    status: STATUS.REJECTED,
    studentCount: 3,
    opinion: 'Temat jest nieaktualny i zbyt teoretyczny. Wymaga modernizacji.'
  },
  {
    name: 'Bezpieczeństwo aplikacji webowych',
    description: 'Analiza podatności systemów CMS na ataki typu SQL Injection oraz XSS wraz z implementacją mechanizmów obronnych zgodnych ze standardami OWASP.',
    status: STATUS.PREPARING,
    studentCount: 2,
  },
  {
    name: 'Zastosowanie uczenia maszynowego w analizie obrazów',
    description: 'Projekt i wytrenowanie konwolucyjnej sieci neuronowej (CNN) do rozpoznawania i klasyfikacji obiektów w czasie rzeczywistym przy użyciu biblioteki TensorFlow.',
    status: STATUS.SUBMITTED,
    studentCount: 1,
  },
  {
    name: 'Analiza wydajności aplikacji webowych',
    description: 'Porównanie wydajności aplikacji frontendowych opartych o różne frameworki JavaScript oraz techniki optymalizacji renderowania.',
    status: STATUS.SUBMITTED,
    studentCount: 3,
  },
  {
    name: 'System rekomendacji oparty na uczeniu maszynowym',
    description: 'Zaprojektowanie i implementacja prostego systemu rekomendacji wykorzystującego algorytmy uczenia maszynowego oraz analizę danych użytkowników.',
    status: STATUS.SUBMITTED,
    studentCount: 4,
  },
  {
    name: 'Bezpieczeństwo aplikacji webowych',
    description: 'Analiza najczęstszych podatności aplikacji webowych (OWASP Top 10) oraz implementacja mechanizmów zabezpieczających.',
    status: STATUS.SUBMITTED,
    studentCount: 2,
  },
  {
    name: 'Projekt i implementacja REST API',
    description: 'Stworzenie skalowalnego API zgodnego z zasadami REST, z uwzględnieniem autoryzacji, paginacji oraz dokumentacji.',
    status: STATUS.SUBMITTED,
    studentCount: 3,
  },
  {
    name: 'Porównanie baz danych SQL i NoSQL',
    description: 'Analiza różnic w modelowaniu danych, wydajności i zastosowaniach relacyjnych oraz nierelacyjnych baz danych.',
    status: STATUS.SUBMITTED,
    studentCount: 2,
  },
  {
    name: 'Aplikacja do zarządzania projektami zespołowymi',
    description: 'Projekt i implementacja aplikacji wspierającej planowanie zadań, komunikację zespołu oraz kontrolę postępów prac.',
    status: STATUS.SUBMITTED,
    studentCount: 4,
  },
  {
    name: 'Monitorowanie i logowanie w systemach rozproszonych',
    description: 'Zastosowanie narzędzi do monitorowania, zbierania logów i analizy błędów w aplikacjach opartych o architekturę mikroserwisów.',
    status: STATUS.SUBMITTED,
    studentCount: 3,
  },
  {
    name: 'Automatyzacja testów aplikacji',
    description: 'Implementacja testów jednostkowych, integracyjnych i end-to-end oraz analiza ich wpływu na jakość oprogramowania.',
    status: STATUS.SUBMITTED,
    studentCount: 2,
  },
  {
    name: 'Aplikacja mobilna wspierająca naukę',
    description: 'Stworzenie aplikacji mobilnej umożliwiającej planowanie nauki, śledzenie postępów oraz powtórki materiału.',
    status: STATUS.SUBMITTED,
    studentCount: 4,
  },
  {
    name: 'Przetwarzanie danych w czasie rzeczywistym',
    description: 'Projekt systemu przetwarzającego strumienie danych w czasie rzeczywistym z wykorzystaniem nowoczesnych narzędzi backendowych.',
    status: STATUS.SUBMITTED,
    studentCount: 3,
  },
];

const createEmail = (name, surname, index="") =>
  `${name.toLowerCase()}.${surname.toLowerCase()}.${index}@pwr.edu.pl`;

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
        mail: createEmail(data.name, data.surname, data.index),
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
        description: `${config.description}`,
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
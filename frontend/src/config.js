export const ACADEMIC_YEAR = "2025/2026";

export const ROLES = {
  KPK_MEMBER: 'Członek KPK',
  TEAM_LEADER: 'Opiekun zespołu',
  TEACHING_SUPERVISOR: 'Opiekun dydaktyki',
  STUDENTS_SUPERVISOR: 'Opiekun studentów',
  STUDENT: 'Student'
};

export const STAUTSES = {
  OPEN: 'Otwarty',
  PREPARING: 'W przygotowaniu do złożenia wniosku',
  SUBMITTED: 'Złożony',
  REJECTED: 'Odrzucony',
  APPROVED: 'Zatwierdzony',
};


export const getTopicColorClasses = (topicStatus) => {
    switch (topicStatus) {
        case STAUTSES.OPEN:
        return 'bg-sky-100 text-gray-800';
        case STAUTSES.SUBMITTED:
        return 'bg-yellow-100 text-gray-800';
        case STAUTSES.APPROVED:
        return 'bg-green-100 text-gray-800';
        case STAUTSES.REJECTED:
        return 'bg-red-100 text-gray-800';
        case STAUTSES.PREPARING:
        return 'bg-violet-100 text-gray-800';
        default:
        'bg-gray-100 text-gray-800'
    };
};
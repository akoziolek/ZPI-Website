export const ACADEMIC_YEAR = "2025/2026";

export const ROLES = {
  KPK_MEMBER: 'Członek KPK',
  TEAM_LEADER: 'Opiekun zespołu',
  TEACHING_SUPERVISOR: 'Opiekun dydaktyki',
  STUDENTS_SUPERVISOR: 'Opiekun studentów',
  STUDENT: 'Student'
};

export const ALL_ROLES = Object.values(ROLES);

export const STATUSES = {
  OPEN: 'Otwarty',
  PREPARING: 'W przygotowaniu do złożenia wniosku',
  SUBMITTED: 'Złożony',
  REJECTED: 'Odrzucony',
  APPROVED: 'Zatwierdzony',
};

export const getTopicColorClasses = (topicStatus) => {
  switch (topicStatus) {
      case STATUSES.OPEN:
      return 'bg-sky-200 text-gray-800';
      case STATUSES.SUBMITTED:
      return 'bg-yellow-200 text-gray-800';
      case STATUSES.APPROVED:
      return 'bg-green-200 text-gray-800';
      case STATUSES.REJECTED:
      return 'bg-red-200 text-gray-800';
      case STATUSES.PREPARING:
      return 'bg-violet-200 text-gray-800';
      default:
      'bg-gray-100 text-gray-800'
  };
};

export const TOPIC_ACTIONS = Object.freeze({
  JOIN: "join",
  WITHDRAW: "withdraw",
  VIEW_OPINION: "view_opinion",
  SIGN: "sign",
  APPROVE: "approve",
  REJECT: "reject",
  EDIT: "edit",
  DELETE: "delete",
  ADD_SUPERIVISON: "add_supervision",
  DEL_SUPERIVISON: "del_supervision",
  ADD_STUDENT: "add_student",
  DEL_STUDENT: "del_student"
});

export const TOPIC_ACTIONS_LABELS = Object.freeze({
  [TOPIC_ACTIONS.JOIN]: "Zapisz się",
  [TOPIC_ACTIONS.WITHDRAW]: "Wypisz się",
  [TOPIC_ACTIONS.VIEW_OPINION]: "Zobacz opinię",
  [TOPIC_ACTIONS.SIGN]: "Podpisz",
  [TOPIC_ACTIONS.APPROVE]: "Zatwierdź",
  [TOPIC_ACTIONS.REJECT]: "Odrzuć",
  [TOPIC_ACTIONS.EDIT]: "Edytuj",
  [TOPIC_ACTIONS.DELETE]: "Usuń",
  [TOPIC_ACTIONS.ADD_SUPERIVISON]: "Zostań opiekunem",
  [TOPIC_ACTIONS.DEL_SUPERIVISON]: "Usuń opiekuna",
  [TOPIC_ACTIONS.ADD_STUDENT]: "Dodaj studentów",
  [TOPIC_ACTIONS.DEL_STUDENT]: "Usuń studentów",
});

const topicActions = {
  [ROLES.STUDENT]: {
    [STATUSES.OPEN]: [TOPIC_ACTIONS.JOIN, TOPIC_ACTIONS.WITHDRAW],
    [STATUSES.PREPARING]: [TOPIC_ACTIONS.SIGN],
    [STATUSES.APPROVED]: [TOPIC_ACTIONS.VIEW_OPINION],
    [STATUSES.REJECTED]: [TOPIC_ACTIONS.VIEW_OPINION],
  },
  [ROLES.KPK_MEMBER]: {
    [STATUSES.SUBMITTED]: [TOPIC_ACTIONS.APPROVE, TOPIC_ACTIONS.REJECT],
    [STATUSES.APPROVED]: [TOPIC_ACTIONS.VIEW_OPINION],
    [STATUSES.REJECTED]: [TOPIC_ACTIONS.VIEW_OPINION]
  },
  [ROLES.TEAM_LEADER]: { 
    [STATUSES.OPEN]: [TOPIC_ACTIONS.EDIT, TOPIC_ACTIONS.DELETE, TOPIC_ACTIONS.ADD_SUPERIVISON, TOPIC_ACTIONS.DEL_SUPERIVISON, TOPIC_ACTIONS.ADD_STUDENT, TOPIC_ACTIONS.DEL_STUDENT],
    [STATUSES.REJECTED]: [TOPIC_ACTIONS.EDIT, TOPIC_ACTIONS.DELETE, TOPIC_ACTIONS.ADD_SUPERIVISON, TOPIC_ACTIONS.DEL_SUPERIVISON,  TOPIC_ACTIONS.ADD_STUDENT, TOPIC_ACTIONS.DEL_STUDENT, TOPIC_ACTIONS.VIEW_OPINION],
    [STATUSES.PREPARING]: [TOPIC_ACTIONS.SIGN, TOPIC_ACTIONS.DELETE],
    [STATUSES.APPROVED]: [TOPIC_ACTIONS.VIEW_OPINION],
  },
  [ROLES.STUDENTS_SUPERVISOR]: {
    [STATUSES.OPEN]: [TOPIC_ACTIONS.ADD_STUDENT, TOPIC_ACTIONS.DEL_STUDENT],
    [STATUSES.REJECTED]: [TOPIC_ACTIONS.ADD_STUDENT, TOPIC_ACTIONS.DEL_STUDENT],    
  }
}

export const getAvailableActions = (role, status) =>
  topicActions[role]?.[status] ?? [];

export const MAX_TOPIC_CAPACITY = 5;
export const MIN_TOPIC_CAPACITY = 2;
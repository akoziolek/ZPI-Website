import { useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../contexts/AuthContext.js';
import { useActionRequest } from './useActionRequest.js'; 
import { TOPIC_ACTIONS, ROLES, getAvailableActions } from "../config.js";

export const useTopicActionsHandlers = () => {
  const request = useActionRequest();
  const navigate = useNavigate();

  return {
    [TOPIC_ACTIONS.APPROVE]: (uuid) =>
      request({
        endpoint: `topics/${uuid}/opinion`,
        method: "POST",
        body: { argumentation: "", isPositive: true },
        successMessage: "Zatwierdzono temat!",
        failureMsg: "Wystąpił błąd podczas dodawania opinii!",
      }),
    [TOPIC_ACTIONS.REJECT]: (uuid) =>
      navigate(`/topics/${uuid}/opinion`),
    [TOPIC_ACTIONS.JOIN]: (uuid) =>
      request({
        endpoint: `topics/${uuid}/join`,
        method: "POST",
        successMessage: "Dopisano do tematu!",
        failureMsg: "Wystąpił problem przy dopisywaniu do tematu!",
      }),
    [TOPIC_ACTIONS.WITHDRAW]: (uuid) => 
      request({
        endpoint: `topics/${uuid}/withdraw`,
        method: "DELETE",
        successMessage: "Wypisano się z tematu!",
        failureMsg: "Wystąpił problem przy wypisywaniu z tematu!",
      }),
    [TOPIC_ACTIONS.SIGN]: (uuid) => 
      request({
        endpoint: `topics/${uuid}/sign`,
        method: "POST",
        successMessage: "Podpisano deklarację!",
        failureMsg: "Podczas autoryzacji podpisu wystąpił błąd!",
      }),
    submitRejection: ({ uuid, argumentation, actions }) => 
      request({
        endpoint: `topics/${uuid}/opinion`,
        method: "POST",
        body: { argumentation: argumentation, isPositive: "false" },
        successMessage: "Odrzucono temat!",
        failureMsg: "Wystąpił błąd podczas dodawania opinii!",
        refresh: false,
        actions: actions 
      }),
  // ... reszta handlerów
  };
};

export const useTopicActions = (topic, signatures, isAssignedToAnyTopic) => {
  const { user } = useAuthContext();
  const handlers = useTopicActionsHandlers(); 

  const allowedActions = useMemo(() => {
    if (!topic || !user) return [];

    const baseActions = getAvailableActions(user.role, topic.status_name);

    const hasSupervisor = !!topic.supervisor;
    const isUserSupervisor = topic.supervisor?.uuid === user.uuid;
    const isStudentTeamMember = topic.students?.some(s => s.uuid === user.uuid);
    const isUserTeamMember = isUserSupervisor || isStudentTeamMember;
    const hasSigned = signatures?.some(sig => sig.uuid === user.uuid);

    const isActionAllowed = (actionId) => {
      switch (actionId) {
        case TOPIC_ACTIONS.JOIN:
          return !isStudentTeamMember && !isAssignedToAnyTopic;
        case TOPIC_ACTIONS.WITHDRAW:
          return isStudentTeamMember;
        case TOPIC_ACTIONS.SIGN:
          return isUserTeamMember && !hasSigned;
        case TOPIC_ACTIONS.VIEW_OPINION:
          return user.role === ROLES.KPK_MEMBER || isUserTeamMember;
        case TOPIC_ACTIONS.ADD_SUPERVISION:
          return !hasSupervisor;
        case TOPIC_ACTIONS.DEL_SUPERVISION:
          return hasSupervisor && isUserSupervisor;
        case TOPIC_ACTIONS.ADD_STUDENT:
          return isUserSupervisor || user.role === ROLES.STUDENTS_SUPERVISOR;
        case TOPIC_ACTIONS.DEL_STUDENT:
          return (isUserSupervisor || user.role === ROLES.STUDENTS_SUPERVISOR) && topic.students?.length > 0;
        default:
          return true;
      }
    };

    return baseActions
      .filter(isActionAllowed)
      .map(actionId => ({
        id: actionId,
        handle: () => handlers[actionId]?.(topic.uuid)
      }));
  }, [topic, user, signatures, isAssignedToAnyTopic, handlers]);

  return allowedActions;
};
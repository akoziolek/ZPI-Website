import { getAvailableActions, TOPIC_ACTIONS, TOPIC_ACTIONS_LABELS, MAX_TOPIC_CAPACITY, MIN_TOPIC_CAPACITY, ROLES } from "../config";
import { useTopicHandlers } from "../hooks/useTopicsHandlers";
import { useAuthContext } from "../contexts/AuthContext.js";

// DO SPRAWDZENIA + POPRAWIC UI
const TopicActionButtons = ({ topic, signatures, isAssignedToAnyTopic }) => {
  const handlers = useTopicHandlers();
  const { user } = useAuthContext();

  if (!topic) return null;

  const baseActions = getAvailableActions(user.role, topic.status_name); 
  
  const hasSupervisor = () => {
    return !!topic.supervisor;
  }

  const isUserSupervisor = () => {
    return (topic.supervisor?.uuid === user.uuid);
  }
  const isStudentTeamMember = () => {
    return topic.students?.some(s => s.uuid === user.uuid)// debug needed for id and uuid
  }
  const isUserTeamMember = () => {
    return isUserSupervisor() || isStudentTeamMember();
  }

  const hasSigned = () => {
    return signatures?.some(sig => sig.uuid === user.uuid);
  }
  
  const isActionAllowed = (actionId) => {
    switch (actionId) {
      case TOPIC_ACTIONS.JOIN:
        return !isStudentTeamMember() && !isAssignedToAnyTopic; 
      case TOPIC_ACTIONS.WITHDRAW:
        return isStudentTeamMember();
      case TOPIC_ACTIONS.SIGN:
        return isUserTeamMember() && !hasSigned();
      case TOPIC_ACTIONS.VIEW_OPINION:
        return user.role === ROLES.KPK_MEMBER || isUserTeamMember();
      case TOPIC_ACTIONS.ADD_SUPERIVISON:
        return !hasSupervisor(); // i nie ma maxa...
      case TOPIC_ACTIONS.DEL_SUPERIVISON:
        return hasSupervisor() && isUserSupervisor(); 
      case TOPIC_ACTIONS.ADD_STUDENT:
        return isUserSupervisor() || user.role === ROLES.STUDENTS_SUPERVISOR;
      case TOPIC_ACTIONS.DEL_STUDENT:
        return (isUserSupervisor()  || user.role === ROLES.STUDENTS_SUPERVISOR) && topic.students?.length != 0; 

      default:
        return true; 
    }
  };

  return (
    <div className="flex gap-2 justify-items-end">
      {baseActions
        .filter(actionId => isActionAllowed(actionId)) // Filtrowanie końcowe
        .map(actionId => (
          <button 
            key={actionId} 
            onClick={() => handlers[actionId](topic.uuid)}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded min-w-xs border border-gray shadow"
          >
            {TOPIC_ACTIONS_LABELS[actionId]}
          </button>
        ))}
    </div>
  );
};

export default TopicActionButtons;
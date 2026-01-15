import { TOPIC_ACTIONS, TOPIC_ACTIONS_LABELS, MAX_TOPIC_CAPACITY, MIN_TOPIC_CAPACITY, ROLES } from "../config";
import { useTopicActions } from "../hooks/useTopicActionsHandlers.js";


// DO SPRAWDZENIA + POPRAWIC UI
const TopicActionButtons = ({ topic, signatures, isAssignedToAnyTopic }) => {
  const actions = useTopicActions(topic, signatures, isAssignedToAnyTopic);
  if (actions.length === 0) return null;
  
  return (
    <div className="flex gap-2 justify-end">
      {actions.map(({ id, handle }) => (
        <button 
          key={id} 
          onClick={handle}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded min-w-xs border border-gray shadow"
        >
          {TOPIC_ACTIONS_LABELS[id]}
        </button>
      ))}
    </div>
  );
};

export default TopicActionButtons;
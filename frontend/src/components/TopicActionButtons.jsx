import { TOPIC_ACTIONS_LABELS } from "../config";
import { useTopicActions } from "../hooks/useTopicActionsHandlers.js";

const TopicActionButtons = ({ topic, signatures }) => {
  const actions = useTopicActions(topic, signatures);
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
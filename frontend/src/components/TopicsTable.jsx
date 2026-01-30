import { Link } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import { getTopicColorClasses } from "../config";

const TopicsTable = ({ topics, sortConfig, onSort }) => {
  const getSortIcon = (key) => {
    const config = sortConfig.find(c => c.key === key);
    if (config) {
      const Icon = config.direction === 'asc' ? ChevronUp : ChevronDown;
      return <Icon className="w-4 h-4 inline ml-1 text-blue-600" />;
    }
    return <ChevronDown className="w-4 h-4 inline ml-1 text-gray-300 opacity-50" />;
  };

  if (topics.length === 0) {
    return <div className="text-center py-8 text-gray-500">Brak tematów do wyświetlenia</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table id="topics-table" className="w-full divide-y divide-gray-200 border-separate border-spacing-y-4">
        <thead>
          <tr>
            {[
              { id: 'name', label: 'Nazwa' },
              { id: 'status_name', label: 'Status' },
              { id: 'supervisor', label: 'Opiekun' },
              { id: 'students', label: 'Liczba studentów' }
            ].map((col) => (
              <th
                key={col.id}
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                onClick={() => onSort(col.id)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  <span className="shrink-0">
                    {getSortIcon(col.id)}
                  </span>
                </div>
              </th>
            ))}
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {topics.map((topic) => (
            <tr key={topic.uuid} data-testid={`topic-row-${topic.name}`} className="hover:bg-gray-200 bg-gray-100">
              <td className="px-6 py-4 border-y border-l border-gray-600">
                <div className="text-sm font-semibold text-gray-900 line-clamp-2 max-w-xs">
                  {topic.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-y border-gray-600">
                <span className={`inline-flex justify-center min-w-full px-2 py-1 text-xs font-semibold rounded-full ${getTopicColorClasses(topic.status_name)}`}>
                  {topic.status_name}
                </span>
              </td>
              <td className="px-6 py-4 border-y border-gray-600  h-24">
                <div className="text-sm font-semibold text-gray-900">
                  {topic.supervisor ? 
                    `${topic.supervisor?.shortcut_academic_title || ""} ${topic.supervisor.name} ${topic.supervisor.surname}` 
                    : 'Brak opiekuna'
                  }
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center border-y border-gray-600">
                <div className="text-sm font-semibold text-gray-900">
                  {topic.students ? topic.students.length : 0}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-y border-r border-gray-600">
                <Link
                  to={`/topics/${topic.uuid}`}
                  className="text-gray-800 bg-gray-300 hover:text-gray-900 px-2 py-1 border border-gray-600 rounded hover:bg-gray-400 transition-colors"
                >
                  Wyświetl
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopicsTable;
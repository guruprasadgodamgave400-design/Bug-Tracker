
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../api/axiosConfig';
import { Plus, MoreHorizontal, Calendar, MessageSquare } from 'lucide-react';

const ProjectBoard = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tickets, setTickets] = useState({
    'To Do': [],
    'In Progress': [],
    'Done': [],
  });
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');

  const fetchData = async () => {
    try {
      const projRes = await api.get(`/projects/${id}`);
      setProject(projRes.data);
      
      const tickRes = await api.get(`/tickets/project/${id}`);
      const grouped = { 'To Do': [], 'In Progress': [], 'Done': [] };
      tickRes.data.forEach(t => {
        if (grouped[t.status]) grouped[t.status].push(t);
        else grouped['To Do'].push(t);
      });
      setTickets(grouped);
    } catch (error) {
      console.error("Error fetching board data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tickets', {
        title: newTitle,
        description: newDesc,
        project: id,
        priority: newPriority,
        status: 'To Do'
      });
      setShowModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewPriority('Medium');
      fetchData();
    } catch (error) {
      console.error("Failed to create ticket", error);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceCol = tickets[source.droppableId];
      const destCol = tickets[destination.droppableId];
      const sourceItems = [...sourceCol];
      const destItems = [...destCol];

      const [removed] = sourceItems.splice(source.index, 1);
      removed.status = destination.droppableId;
      destItems.splice(destination.index, 0, removed);

      setTickets({
        ...tickets,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      });

      try {
        await api.put(`/tickets/${removed._id}`, { status: destination.droppableId });
      } catch (error) {
        console.error('Failed to update ticket status', error);
      }
    } else {
      const column = tickets[source.droppableId];
      const copiedItems = [...column];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setTickets({
        ...tickets,
        [source.droppableId]: copiedItems,
      });
    }
  };

  const priorityColors = {
    'Low': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Medium': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'High': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'Urgent': 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading board...</div>;

  return (
    <div className="h-full flex flex-col p-8 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{project?.title}</h1>
          <p className="text-gray-400 text-sm mt-1">{project?.description}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Create Issue
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-1 gap-6 overflow-x-auto pb-4 items-start">
          {Object.entries(tickets).map(([columnId, columnTickets]) => (
            <div key={columnId} className="flex flex-col w-80 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-200">{columnId}</h3>
                  <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                    {columnTickets.length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 bg-gray-900/50 rounded-xl p-3 border flex flex-col gap-3 min-h-[150px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-gray-800/50 border-indigo-500/30' : 'border-gray-800'
                    }`}
                  >
                    {columnTickets.map((ticket, index) => (
                      <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-gray-800/90 border border-gray-700 rounded-lg p-4 cursor-grab hover:border-gray-600 transition-colors shadow-sm ${
                              snapshot.isDragging ? 'shadow-xl shadow-black/50 border-indigo-500 ring-1 ring-indigo-500' : ''
                            }`}
                            style={{ ...provided.draggableProps.style }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${priorityColors[ticket.priority]}`}>
                                {ticket.priority}
                              </span>
                              <button className="text-gray-500 hover:text-gray-300">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                            <h4 className="text-sm font-medium text-gray-200 mb-3">{ticket.title}</h4>
                            
                            <div className="flex items-center justify-between text-gray-500 text-xs">
                              <div className="flex space-x-3">
                                {ticket.assignee && (
                                  <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold" title={ticket.assignee.name}>
                                    {ticket.assignee.name?.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="flex space-x-3">
                                <div className="flex items-center">
                                  <MessageSquare size={14} className="mr-1" /> 0
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Create New Issue</h2>
            <form onSubmit={handleCreateTicket}>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Issue Title</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Priority</label>
                <select 
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">Description</label>
                <textarea 
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;

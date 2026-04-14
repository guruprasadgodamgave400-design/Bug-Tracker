import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { title: newTitle, description: newDesc });
      setShowModal(false);
      setNewTitle('');
      setNewDesc('');
      fetchProjects();
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-gray-400 mt-1">Manage and access all your team's projects.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors">
          <Plus size={18} className="mr-2" />
          New Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>
      ) : projects.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
          <p className="text-gray-400 mb-6">Get started by creating your first project.</p>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link 
              key={project._id} 
              to={`/projects/${project._id}`}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all block group"
            >
              <h3 className="text-xl font-bold text-gray-100 group-hover:text-indigo-400 transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                {project.description || 'No description available for this project.'}
              </p>
              
              <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-auto">
                <div className="flex -space-x-2">
                  {project.members?.slice(0, 3).map((member, i) => (
                    <div key={member._id} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-gray-900 z-${30-i*10}`} style={{ backgroundColor: `hsl(${i * 60 + 200}, 70%, 50%)` }}>
                      {member.name?.charAt(0)}
                    </div>
                  ))}
                  {project.members?.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-300 ring-2 ring-gray-900 z-0">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md">
                  Active
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Project Name</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">Description (Optional)</label>
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

export default Dashboard;

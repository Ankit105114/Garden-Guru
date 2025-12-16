import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Newspaper, MonitorPlay, ExternalLink, Plus, Trash2 } from 'lucide-react';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [type, setType] = useState('Article');
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/resources');
            setResources(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/resources/${id}`);
            setResources(resources.filter(r => r._id !== id));
        } catch (err) {
            alert('Failed to delete resource');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/resources', {
                title, type, description, url, imageUrl
            });
            setResources([res.data, ...resources]);
            setShowForm(false);
            resetForm();
        } catch (err) {
            alert('Error adding resource');
        }
    };

    const resetForm = () => {
        setTitle('');
        setType('Article');
        setDescription('');
        setUrl('');
        setImageUrl('');
    };

    const getTypeIcon = (resourceType) => {
        switch (resourceType) {
            case 'Book': return <BookOpen className="text-purple-500" />;
            case 'Video': return <MonitorPlay className="text-red-500" />;
            default: return <Newspaper className="text-blue-500" />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Gardening Resources</h1>
                    <p className="text-gray-600">Community curated books, articles, and guides.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full font-bold flex items-center transition"
                >
                    <Plus size={20} className="mr-2" />
                    Share Resource
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-green-100 animate-fade-in-up max-w-2xl mx-auto">
                    <h3 className="font-bold text-xl mb-4 text-gray-800">Add New Resource</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Title</label>
                                <input type="text" className="w-full border rounded-lg p-2" value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Type</label>
                                <select className="w-full border rounded-lg p-2" value={type} onChange={e => setType(e.target.value)}>
                                    <option>Article</option>
                                    <option>Book</option>
                                    <option>Blog</option>
                                    <option>Video</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
                            <textarea className="w-full border rounded-lg p-2" rows="2" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Link URL</label>
                                <input type="url" className="w-full border rounded-lg p-2" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Image URL</label>
                                <input type="url" className="w-full border rounded-lg p-2" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Cover image..." />
                            </div>
                        </div>
                        <div className="pt-2 flex justify-end space-x-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">Publish</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? <div className="text-center py-10">Loading resources...</div> : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map(item => (
                        <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group relative">
                            {/* Delete Button (Visible on hover if needed, or always) */}
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>

                            {item.imageUrl && (
                                <div className="h-48 overflow-hidden bg-gray-100">
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition transform group-hover:scale-105" />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                                        {getTypeIcon(item.type)}
                                        <span>{item.type}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{item.title}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{item.description}</p>

                                {item.url && (
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary font-bold hover:underline">
                                        Read More <ExternalLink size={16} className="ml-1" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Resources;

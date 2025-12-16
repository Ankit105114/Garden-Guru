import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Sun, CloudRain, Bug, Sprout, Leaf, Trash2, Droplets, Plus } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const PlantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [plant, setPlant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '', scientificName: '', waterFrequency: '', sunlight: '', fertilizer: '', pests: '', imageUrl: '', careGuide: ''
    });

    // Add to Garden State
    const [showModal, setShowModal] = useState(false);
    const [nickname, setNickname] = useState('');
    const [startStage, setStartStage] = useState('Seed');
    const [adding, setAdding] = useState(false);

    const addToGarden = async () => {
        setAdding(true);
        try {
            await axios.post('http://localhost:5001/api/garden', {
                plantId: plant._id,
                nickname,
                stage: startStage
            });
            alert('Added to your garden!');
            setShowModal(false);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to add to garden');
        } finally {
            setAdding(false);
        }
    };

    const fetchPlant = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5001/api/plants/${id}`);
            const data = res.data;
            setPlant(data);
            setEditForm({
                name: data.name || '',
                scientificName: data.scientificName || '',
                waterFrequency: data.waterFrequency || '',
                sunlight: data.sunlight || '',
                fertilizer: data.fertilizer || '',
                pests: data.pests || '',
                imageUrl: data.imageUrl || '',
                careGuide: data.careGuide || ''
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5001/api/plants/${id}`, editForm);
            setPlant(res.data);
            setEditing(false);
            alert('Plant updated successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to update plant');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this plant from the library?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/plants/${id}`);
            alert('Plant deleted successfully');
            navigate('/plants');
        } catch (err) {
            console.error(err);
            alert('Failed to delete plant');
        }
    };

    useEffect(() => {
        fetchPlant();
    }, [id]);


    if (loading) return <div className="p-10 text-center">Loading plant details...</div>;
    if (!plant) return <div className="p-10 text-center">Plant not found</div>;

    return (
        <div className="min-h-screen bg-green-50/50 pb-20">
            <div className="h-96 w-full relative">
                <img
                    src={plant.imageUrl || 'https://images.unsplash.com/photo-1416879895648-5d436e3bd849?w=1920&q=80'}
                    alt={plant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent"></div>

                <div className="absolute top-6 left-6 z-20">
                    <button
                        onClick={() => navigate('/plants')}
                        className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 group"
                    >
                        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Plant Details</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Name</label>
                                    <input className="w-full border rounded p-2" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Scientific Name</label>
                                    <input className="w-full border rounded p-2" value={editForm.scientificName} onChange={e => setEditForm({ ...editForm, scientificName: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Watering</label>
                                    <input className="w-full border rounded p-2" value={editForm.waterFrequency} onChange={e => setEditForm({ ...editForm, waterFrequency: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Sunlight</label>
                                    <input className="w-full border rounded p-2" value={editForm.sunlight} onChange={e => setEditForm({ ...editForm, sunlight: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Fertilizer</label>
                                    <input className="w-full border rounded p-2" value={editForm.fertilizer} onChange={e => setEditForm({ ...editForm, fertilizer: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Pests</label>
                                    <input className="w-full border rounded p-2" value={editForm.pests} onChange={e => setEditForm({ ...editForm, pests: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Image URL</label>
                                <input className="w-full border rounded p-2" value={editForm.imageUrl} onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Care Guide (Markdown supported)</label>
                                <textarea
                                    className="w-full border rounded p-2"
                                    rows="6"
                                    value={editForm.careGuide}
                                    onChange={e => setEditForm({ ...editForm, careGuide: e.target.value })}
                                    placeholder="Write detailed care instructions here..."
                                ></textarea>
                            </div>
                            <div className="flex space-x-4 pt-4">
                                <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg font-bold">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 -mt-20 relative z-10 max-w-4xl">
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-1">{plant.name}</h1>
                            <p className="text-lg text-gray-500 italic mb-4">{plant.scientificName}</p>
                        </div>
                        <div className="flex gap-3">
                            {/* Edit Button */}
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-blue-50 text-blue-500 hover:bg-blue-100 px-6 py-3 rounded-xl font-bold transition flex items-center shadow-sm"
                            >
                                Edit
                            </button>
                            {/* Delete Button (User Requested Feature) */}
                            <button
                                onClick={handleDelete}
                                className="bg-red-50 text-red-500 hover:bg-red-100 px-6 py-3 rounded-xl font-bold transition flex items-center shadow-sm"
                            >
                                <Trash2 className="mr-2" size={20} />
                                Delete
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition shadow-lg flex items-center transform hover:scale-105"
                            >
                                <Leaf className="mr-2" />
                                Add to Garden
                            </button>
                        </div>
                    </div>

                    {/* ... Rest of existing details layout ... */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* ... (existing grids) ... */}
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mr-4">
                                    <Droplets size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Watering</h3>
                                    <p className="text-gray-600">{plant.waterFrequency}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600 mr-4">
                                    <Sun size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Sunlight</h3>
                                    <p className="text-gray-600">{plant.sunlight}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-red-100 p-3 rounded-lg text-red-600 mr-4">
                                    <Bug size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Pests & Diseases</h3>
                                    <p className="text-gray-600">{plant.pests}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-green-100 p-3 rounded-lg text-green-600 mr-4">
                                    <Sprout size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Fertilizer</h3>
                                    <p className="text-gray-600">{plant.fertilizer}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Care Guide Section */}
                    <div className="mt-8 border-t pt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <Leaf className="mr-2 text-green-500" /> Care Guide
                        </h2>
                        {plant.careGuide ? (
                            <div className="prose max-w-none text-gray-600 whitespace-pre-line bg-green-50 p-6 rounded-xl border border-green-100">
                                {plant.careGuide}
                            </div>
                        ) : (
                            <div className="text-gray-400 italic bg-gray-50 p-6 rounded-xl text-center">
                                No detailed care guide added yet. Click "Edit" to add one.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add to Garden Modal (Existing) */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add to Your Garden</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Nickname (Optional)</label>
                            <input
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="e.g. My Big Tomato"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Starting Stage</label>
                            <select
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={startStage}
                                onChange={(e) => setStartStage(e.target.value)}
                            >
                                <option value="Seed">Seed (Start from scratch)</option>
                                <option value="Sapling">Sapling (Skip early stages)</option>
                                <option value="Tree">Tree (Already grown)</option>
                            </select>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 text-gray-500 hover:bg-gray-100 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addToGarden}
                                disabled={adding}
                                className={`flex-1 py-3 rounded-xl font-bold text-white transition shadow-lg ${adding ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                            >
                                {adding ? 'Adding...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlantDetails;

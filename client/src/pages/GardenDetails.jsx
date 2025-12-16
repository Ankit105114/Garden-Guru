import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Droplet, Sun, Ruler, Camera, Save, BookOpen, Trash2 } from 'lucide-react';
import PlantVisual from '../components/PlantVisual';
import AuthContext from '../context/AuthContext';

const GardenDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [gardenItem, setGardenItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogForm, setShowLogForm] = useState(false);

    // Edit Form State
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ nickname: '', notes: '', stage: '' });

    // Log Form State
    const [logNote, setLogNote] = useState('');
    const [logHeight, setLogHeight] = useState('');
    const [logPhoto, setLogPhoto] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // Fetch direct item details (works for active and deleted)
            const res = await axios.get(`http://localhost:5001/api/garden/${id}`);
            const item = res.data;

            // Fetch logs for this item
            if (item) {
                const logsRes = await axios.get(`http://localhost:5001/api/garden/${id}/logs`);
                item.logs = logsRes.data;
                setEditForm({
                    nickname: item.nickname || '',
                    notes: item.notes || '',
                    stage: item.stage || 'Seed'
                });
            }

            setGardenItem(item);
        } catch (err) {
            console.error(err);
            // Optionally redirect if not found
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5001/api/garden/${id}`, editForm);
            // Refresh Data to get everything clean
            fetchData();
            setEditing(false);
        } catch (err) {
            console.error(err);
            alert('Failed to update details');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to remove this plant from your garden? (Logs will be kept)')) return;
        try {
            await axios.delete(`http://localhost:5001/api/garden/${id}`);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to delete');
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Simulate Upload: Convert to Base64/DataURL for local demo purposes
            // In a real app, you would upload to AWS S3/Cloudinary here.
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5001/api/garden/${id}/logs`, {
                notes: logNote,
                height: logHeight,
                photoUrl: logPhoto
            });

            // Update local state with new XP/Stage from response
            setGardenItem(res.data.gardenItem);
            // Re-fetch to get sorted logs
            fetchData();

            setShowLogForm(false);
            setLogNote('');
            setLogHeight('');
            setLogPhoto('');
            alert(`Log added! You gained 50 XP!`);
        } catch (err) {
            console.error(err);
            alert('Failed to add log');
        }
    };

    const handleDeleteLog = async (logId) => {
        if (!window.confirm('Are you sure you want to delete this log entry?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/garden/${id}/logs/${logId}`);
            // Refresh data to update the logs list
            fetchData();
            alert('Log deleted successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to delete log');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!gardenItem) return <div className="p-10 text-center">Plant not found</div>;

    const progressPercentage = (gardenItem.xp % 100);

    return (
        <div className="min-h-screen bg-green-50 pb-20">
            {/* Header */}
            <div className="bg-white shadow-sm p-4 sticky top-0 z-10 flex items-center justify-between">
                <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-primary">
                    <ArrowLeft />
                </button>
                <div className="flex gap-2">
                    <button onClick={() => setEditing(true)} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">Edit</button>
                    <button onClick={handleDelete} className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-lg">Delete</button>
                </div>
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
                        <h3 className="font-bold text-lg mb-4">Edit Garden Plant</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Nickname</label>
                                <input className="w-full border rounded p-2" value={editForm.nickname} onChange={e => setEditForm({ ...editForm, nickname: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Notes</label>
                                <textarea className="w-full border rounded p-2" rows="2" value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Stage</label>
                                <select className="w-full border rounded p-2" value={editForm.stage} onChange={e => setEditForm({ ...editForm, stage: e.target.value })}>
                                    <option value="Seed">Seed</option>
                                    <option value="Sprout">Sprout</option>
                                    <option value="Sapling">Sapling</option>
                                    <option value="Tree">Tree</option>
                                    <option value="Mature">Mature</option>
                                </select>
                            </div>
                            <div className="flex space-x-2 pt-2">
                                <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="container mx-auto max-w-md mt-8 px-4">

                {/* Visual Stage */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 text-center relative overflow-hidden">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{gardenItem.nickname || gardenItem.plant?.name}</h2>
                    <p className="text-sm text-gray-500 mb-6">{gardenItem.plant?.name}</p>

                    <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
                        <div className="h-full bg-yellow-400 transition-all duration-1000" style={{ width: `${Math.min((gardenItem.xp || 0) / 10, 100)}%` }}></div>
                    </div>
                    {/* ... (Visuals) ... */}
                    <div className="py-6">
                        <PlantVisual stage={gardenItem.stage} size={80} />
                    </div>
                    {/* ... (Stats) ... */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-blue-50 p-4 rounded-2xl flex flex-col items-center">
                            <Droplet size={24} className="text-blue-500 mb-2" />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Water</span>
                            <span className="font-semibold text-gray-700 text-center">{gardenItem.plant?.waterFrequency || 'Unknown'}</span>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-2xl flex flex-col items-center">
                            <Sun size={24} className="text-yellow-500 mb-2" />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Sunlight</span>
                            <span className="font-semibold text-gray-700 text-center">{gardenItem.plant?.sunlight || 'Unknown'}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setShowLogForm(true)}
                        className="bg-primary hover:bg-primary-dark text-white py-4 rounded-xl shadow-md flex flex-col items-center justify-center transition transform hover:scale-105"
                    >
                        <Camera size={24} className="mb-2" />
                        <span className="font-bold">Log Growth</span>
                    </button>
                    {/* Details button is redundant now that we have edit, maybe link to library page? */}
                    {/* Details button linked to library - only if plant exists */}
                    {gardenItem.plant && (
                        <button onClick={() => navigate(`/plants/${gardenItem.plant._id}`)} className="bg-white hover:bg-green-50 text-gray-800 py-4 rounded-xl shadow-md flex flex-col items-center justify-center transition border border-gray-100 group">
                            <BookOpen size={24} className="mb-2 text-green-600 group-hover:scale-110 transition-transform" />
                            <span className="font-bold">Read Care Guide</span>
                        </button>
                    )}
                    {!gardenItem.plant && (
                        <button disabled className="bg-gray-100 text-gray-400 py-4 rounded-xl shadow-none flex flex-col items-center justify-center cursor-not-allowed">
                            <Ruler size={24} className="mb-2" />
                            <span className="font-bold">Guide Unavailable</span>
                        </button>
                    )}
                </div>

                {/* Log Form Modal/Inline */}
                {showLogForm && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in-up mb-8">
                        <h3 className="font-bold text-lg mb-4">Record Growth</h3>
                        <form onSubmit={handleLogSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Notes</label>
                                <textarea
                                    className="w-full border rounded-lg p-2"
                                    rows="2"
                                    value={logNote}
                                    onChange={e => setLogNote(e.target.value)}
                                    placeholder="Looking healthy today..."
                                    required
                                ></textarea>
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">Height (cm)</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded-lg p-2"
                                        value={logHeight}
                                        onChange={e => setLogHeight(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Photo</label>
                                {/* File Input for Camera/Upload */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment" // Hints mobile to use rear camera
                                    className="w-full mb-2"
                                    onChange={handlePhotoUpload}
                                />
                                <div className="text-center text-gray-400 text-xs mb-2">- OR -</div>
                                <input
                                    type="url"
                                    className="w-full border rounded-lg p-2"
                                    value={logPhoto}
                                    onChange={e => setLogPhoto(e.target.value)}
                                    placeholder="Paste Image URL..."
                                />
                                {logPhoto && (
                                    <div className="mt-2 h-20 w-20 rounded-lg overflow-hidden border">
                                        <img src={logPhoto} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-3 pt-2">
                                <button type="button" onClick={() => setShowLogForm(false)} className="flex-1 py-2 text-gray-500">Cancel</button>
                                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold">Save (+50 XP)</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Growth Timeline */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Growth History</h3>
                    <div className="space-y-6 pl-4 border-l-2 border-gray-200 ml-2">
                        {gardenItem.logs && gardenItem.logs.length > 0 ? (
                            gardenItem.logs.map((log) => (
                                <div key={log._id || Math.random()} className="relative pl-6">
                                    <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-xs text-gray-500">{new Date(log.date || Date.now()).toLocaleDateString()}</p>
                                            <button
                                                onClick={() => handleDeleteLog(log._id)}
                                                className="text-red-400 hover:text-red-600 transition"
                                                title="Delete log"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="text-gray-800 font-medium mb-2">{log.notes}</p>
                                        {log.height && <p className="text-sm text-gray-600 mb-2">Height: {log.height} cm</p>}
                                        {log.photoUrl && (
                                            <div className="mt-2 rounded-lg overflow-hidden h-32 w-full">
                                                <img src={log.photoUrl} alt="Growth Log" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 pl-6 italic">No logs yet. Start tracking today!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GardenDetails;

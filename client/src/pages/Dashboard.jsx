import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Plus, Sprout, TrendingUp, Award, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [garden, setGarden] = useState([]);
    const [bin, setBin] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBin, setShowBin] = useState(false);

    useEffect(() => {
        fetchGarden();
    }, [showBin]);

    const fetchGarden = async () => {
        setLoading(true);
        try {
            if (showBin) {
                const res = await axios.get('http://localhost:5001/api/garden/bin');
                setBin(res.data);
            } else {
                const res = await axios.get('http://localhost:5001/api/garden');
                setGarden(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id) => {
        try {
            await axios.put(`http://localhost:5001/api/garden/${id}/restore`);
            fetchGarden(); // Refresh bin list
            alert('Plant restored to your garden!');
        } catch (err) {
            console.error(err);
            alert('Failed to restore');
        }
    };

    const handlePermanentDelete = async (id) => {
        if (!window.confirm('Are you certain? This will delete the plant and all its growth logs FOREVER.')) return;
        try {
            await axios.delete(`http://localhost:5001/api/garden/${id}/permanent`);
            fetchGarden(); // Refresh bin list
        } catch (err) {
            console.error(err);
            alert('Failed to delete permanently');
        }
    };

    // Calculate stats
    const totalPlants = garden.length;
    const totalXP = garden.reduce((sum, item) => sum + (item.xp || 0), 0);
    const maturePlants = garden.filter(item => item.stage === 'Mature' || item.stage === 'Tree').length;

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Welcome Banner */}
            {!showBin && (
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 flex items-center">
                                <Sparkles className="mr-3" size={36} />
                                Welcome back, {user?.name || 'Gardener'}!
                            </h1>
                            <p className="text-green-100 text-lg">Your garden is thriving. Keep up the great work!</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Total Plants</p>
                                    <p className="text-3xl font-bold">{totalPlants}</p>
                                </div>
                                <Sprout size={32} className="text-green-200" />
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Total XP</p>
                                    <p className="text-3xl font-bold">{totalXP}</p>
                                </div>
                                <TrendingUp size={32} className="text-green-200" />
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Mature Plants</p>
                                    <p className="text-3xl font-bold">{maturePlants}</p>
                                </div>
                                <Award size={32} className="text-green-200" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">{showBin ? 'Recycle Bin' : 'My Garden'}</h1>
                    <button
                        onClick={() => setShowBin(!showBin)}
                        className={`text-sm px-3 py-1 rounded-full border ${showBin ? 'bg-gray-200 text-gray-700' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                    >
                        {showBin ? 'Back to Garden' : 'Show Bin'}
                    </button>
                </div>
                {!showBin && (
                    <Link to="/plants" className="flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition">
                        <Plus size={20} className="mr-2" />
                        Add Plant
                    </Link>
                )}
            </div>

            {showBin ? (
                // BIN VIEW
                bin.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">Bin is empty.</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {bin.map(item => (
                            <div key={item._id} className="bg-gray-100 rounded-xl shadow-sm border border-gray-200 overflow-hidden opacity-75">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-600 line-through">{item.nickname || item.plant?.name}</h3>
                                            <p className="text-sm text-gray-500">{item.plant?.name}</p>
                                        </div>
                                        <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Deleted</div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleRestore(item._id)}
                                            className="flex-1 py-2 bg-green-100 text-green-700 font-bold rounded hover:bg-green-200"
                                        >
                                            Restore
                                        </button>
                                        <button
                                            onClick={() => handlePermanentDelete(item._id)}
                                            className="flex-1 py-2 bg-red-100 text-red-700 font-bold rounded hover:bg-red-200"
                                        >
                                            Delete Forever
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                // GARDEN VIEW
                garden.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 mb-12">
                        <h3 className="text-xl text-gray-600 mb-4">Your garden is empty</h3>
                        <p className="text-gray-500 mb-6">Start by adding some plants from our library.</p>
                        <Link to="/plants" className="text-primary font-semibold hover:underline">
                            Browse Plants
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {garden.map(item => (
                            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">{item.nickname || item.plant.name}</h3>
                                            <p className="text-sm text-gray-500">{item.plant.name}</p>
                                        </div>
                                        {item.plant.imageUrl && <img src={item.plant.imageUrl} alt={item.plant.name} className="w-12 h-12 rounded-full object-cover" />}
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <p><span className="font-semibold">Water:</span> {item.plant.waterFrequency}</p>
                                        <p><span className="font-semibold">Sunlight:</span> {item.plant.sunlight}</p>
                                        <p><span className="font-semibold text-primary">Stage:</span> {item.stage || 'Seed'}</p>
                                    </div>
                                    <Link to={`/garden/${item._id}`} className="block text-center w-full py-2 bg-gray-50 hover:bg-gray-100 text-primary font-medium rounded-md transition">
                                        View & Grow
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default Dashboard;

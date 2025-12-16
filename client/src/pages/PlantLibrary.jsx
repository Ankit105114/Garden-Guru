import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlantLibrary = () => {
    const [plants, setPlants] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlants();
    }, []);

    const fetchPlants = async (searchQuery = '') => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5001/api/plants?search=${searchQuery}`);
            setPlants(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this plant from the library?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/plants/${id}`);
            setPlants(plants.filter(p => p._id !== id));
        } catch (err) {
            alert('Failed to delete plant');
            console.error(err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPlants(search);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Plant Library</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                    Explore our collection of plants and add them to your garden to get started.
                </p>
                <Link to="/add-plant" className="inline-flex items-center bg-secondary hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition shadow-md">
                    <Plus size={18} className="mr-2" /> Contribute a Plant
                </Link>
            </div>

            <div className="max-w-2xl mx-auto mb-10">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search for plants..."
                        className="w-full px-5 py-4 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                    <button type="submit" className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary-dark text-white px-6 rounded-full font-medium transition">
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="text-center p-8">Loading plants...</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plants.map(plant => (
                        <div key={plant._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
                            <div className="h-48 overflow-hidden bg-gray-200 relative group">
                                {plant.imageUrl ? (
                                    <>
                                        <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-2xl font-bold text-gray-800 mb-1">{plant.name}</h3>
                                <p className="text-sm text-primary font-medium mb-4 italic">{plant.scientificName}</p>

                                <div className="space-y-2 mb-6 flex-grow">
                                    <p className="text-gray-600 text-sm"><span className="font-semibold text-gray-800">Water:</span> {plant.waterFrequency}</p>
                                    <p className="text-gray-600 text-sm"><span className="font-semibold text-gray-800">Sun:</span> {plant.sunlight}</p>
                                </div>

                                <div className="mt-auto">
                                    {/* Placeholder for Add action - needs Auth check inside or just prompt login */}
                                    {/* For now, just a button/link that does nothing or goes to details */}
                                    <div className="flex space-x-2">
                                        <Link to={`/plants/${plant._id}`} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition text-center">
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(plant._id)}
                                            className="bg-red-50 text-red-500 hover:bg-red-100 px-4 rounded-lg transition"
                                            title="Delete Plant"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {plants.length === 0 && !loading && (
                        <div className="col-span-3 text-center py-10 text-gray-500">
                            No plants found. Try a different search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlantLibrary;

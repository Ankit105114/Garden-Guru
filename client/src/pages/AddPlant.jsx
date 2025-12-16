import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ArrowLeft, Upload } from 'lucide-react';

const AddPlant = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        scientificName: '',
        waterFrequency: '',
        sunlight: '',
        fertilizer: '',
        pests: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);

    const { name, scientificName, waterFrequency, sunlight, fertilizer, pests, imageUrl } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5001/api/plants', formData);
            navigate('/plants');
        } catch (err) {
            console.error(err);
            alert('Error adding plant');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary mb-6 transition">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Contribute a Plant</h1>
                    <p className="text-gray-600 mb-8">Help the community grow by adding a new plant to our database.</p>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Common Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="e.g. Tomato"
                                    value={name}
                                    onChange={onChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Scientific Name</label>
                                <input
                                    type="text"
                                    name="scientificName"
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="e.g. Solanum lycopersicum"
                                    value={scientificName}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                                type="url"
                                name="imageUrl"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={onChange}
                            />
                            {imageUrl && (
                                <div className="mt-2 h-40 w-full bg-gray-100 rounded-lg overflow-hidden">
                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Watering</label>
                                <input
                                    type="text"
                                    name="waterFrequency"
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="e.g. Every 2-3 days"
                                    value={waterFrequency}
                                    onChange={onChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sunlight</label>
                                <input
                                    type="text"
                                    name="sunlight"
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="e.g. Full Sun"
                                    value={sunlight}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fertilizer</label>
                                <input
                                    type="text"
                                    name="fertilizer"
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="e.g. Balanced monthly"
                                    value={fertilizer}
                                    onChange={onChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pests</label>
                                <input
                                    type="text"
                                    name="pests"
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="e.g. Aphids"
                                    value={pests}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-lg text-white transition shadow-lg ${loading ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'}`}
                        >
                            {loading ? 'Adding Plant...' : 'Submit Plant'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPlant;

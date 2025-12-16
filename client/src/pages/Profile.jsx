import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { User, Mail, Calendar, Trash2, Edit2, Save, X, Award, Sprout, TrendingUp, Camera } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        bio: '',
        location: '',
        favoriteePlant: ''
    });

    const [stats, setStats] = useState({
        totalPlants: 0,
        totalXP: 0,
        maturePlants: 0,
        joinedDate: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                location: user.location || '',
                favoritePlant: user.favoritePlant || ''
            });
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/garden');
            const garden = res.data;

            setStats({
                totalPlants: garden.length,
                totalXP: garden.reduce((sum, item) => sum + (item.xp || 0), 0),
                maturePlants: garden.filter(item => item.stage === 'Mature' || item.stage === 'Tree').length,
                joinedDate: user?.createdAt || new Date().toISOString()
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5001/api/auth/profile', profileData);
            alert('Profile updated successfully!');
            setEditing(false);
            // Refresh user context if needed
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            alert('Please type DELETE to confirm');
            return;
        }

        try {
            await axios.delete('http://localhost:5001/api/auth/account');
            alert('Account deleted successfully');
            logout();
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Failed to delete account');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Profile Header Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    {/* Cover Image */}
                    <div className="h-48 bg-gradient-to-r from-green-500 to-green-600 relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    {/* Profile Info */}
                    <div className="relative px-8 pb-8">
                        {/* Avatar */}
                        <div className="absolute -top-16 left-8">
                            <div className="w-32 h-32 rounded-full bg-white p-2 shadow-xl">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-4xl font-bold">
                                    {profileData.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <div className="pt-20 flex justify-end">
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="flex items-center bg-green-50 text-green-600 hover:bg-green-100 px-6 py-2 rounded-full font-medium transition"
                                >
                                    <Edit2 size={18} className="mr-2" />
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={() => setEditing(false)}
                                    className="flex items-center bg-gray-100 text-gray-600 hover:bg-gray-200 px-6 py-2 rounded-full font-medium transition"
                                >
                                    <X size={18} className="mr-2" />
                                    Cancel
                                </button>
                            )}
                        </div>

                        {/* Profile Details */}
                        {editing ? (
                            <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                        rows="3"
                                        placeholder="Tell us about your gardening journey..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                                        <input
                                            type="text"
                                            value={profileData.location}
                                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Favorite Plant</label>
                                        <input
                                            type="text"
                                            value={profileData.favoritePlant}
                                            onChange={(e) => setProfileData({ ...profileData, favoritePlant: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g., Tomato"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center"
                                >
                                    <Save size={20} className="mr-2" />
                                    Save Changes
                                </button>
                            </form>
                        ) : (
                            <div className="mt-4">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{profileData.name}</h1>
                                <div className="flex items-center text-gray-600 mb-4">
                                    <Mail size={16} className="mr-2" />
                                    {profileData.email}
                                </div>
                                {profileData.bio && (
                                    <p className="text-gray-600 mb-4">{profileData.bio}</p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm">
                                    {profileData.location && (
                                        <div className="flex items-center text-gray-600">
                                            <span className="font-semibold mr-2">📍</span>
                                            {profileData.location}
                                        </div>
                                    )}
                                    {profileData.favoritePlant && (
                                        <div className="flex items-center text-gray-600">
                                            <Sprout size={16} className="mr-2 text-green-600" />
                                            Loves {profileData.favoritePlant}
                                        </div>
                                    )}
                                    <div className="flex items-center text-gray-600">
                                        <Calendar size={16} className="mr-2" />
                                        Joined {formatDate(stats.joinedDate)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Plants</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalPlants}</p>
                            </div>
                            <Sprout size={40} className="text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total XP</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalXP}</p>
                            </div>
                            <TrendingUp size={40} className="text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Mature Plants</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.maturePlants}</p>
                            </div>
                            <Award size={40} className="text-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-200">
                    <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
                        <Trash2 className="mr-2" />
                        Danger Zone
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Once you delete your account, there is no going back. This will permanently delete your account,
                        all your plants, growth logs, and data.
                    </p>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-6 py-3 rounded-xl font-bold transition"
                        >
                            Delete Account
                        </button>
                    ) : (
                        <div className="bg-red-50 p-6 rounded-xl">
                            <p className="text-red-800 font-bold mb-4">
                                Are you absolutely sure? Type "DELETE" to confirm:
                            </p>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-red-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Type DELETE"
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition"
                                >
                                    Permanently Delete Account
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeleteConfirmText('');
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-bold transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

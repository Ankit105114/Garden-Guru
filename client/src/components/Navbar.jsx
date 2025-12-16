import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Sprout, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center text-primary-dark font-bold text-xl">
                    <Sprout className="mr-2" />
                    GardenGuru
                </Link>

                <div className="flex items-center space-x-2">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="bg-primary/5 hover:bg-primary hover:text-white text-primary px-4 py-2 rounded-full font-medium transition duration-300">
                                My Garden
                            </Link>
                            <Link to="/plants" className="bg-primary/5 hover:bg-primary hover:text-white text-primary px-4 py-2 rounded-full font-medium transition duration-300">
                                Library
                            </Link>
                            <Link to="/reminders" className="bg-primary/5 hover:bg-primary hover:text-white text-primary px-4 py-2 rounded-full font-medium transition duration-300">
                                Reminders
                            </Link>
                            <Link to="/resources" className="bg-primary/5 hover:bg-primary hover:text-white text-primary px-4 py-2 rounded-full font-medium transition duration-300">
                                Info
                            </Link>

                            <div className="flex items-center text-gray-700 ml-4 border-l pl-4">
                                <Link to="/profile" className="flex items-center hover:text-primary transition">
                                    <User className="w-5 h-5 mr-1" />
                                    <span className="font-medium mr-4">{user.name}</span>
                                </Link>
                                <button onClick={logout} className="text-gray-500 hover:text-red-500 transition">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-primary font-medium px-4">Login</Link>
                            <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full font-bold transition shadow-md">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

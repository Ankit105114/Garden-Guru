import { Link } from 'react-router-dom';
import { Sprout, Sun, Droplets } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-50 to-green-100 py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-5xl font-bold text-gray-800 mb-6">
                        Grow Your Dream Garden with <span className="text-primary">GardenGuru</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Your personal gardening assistant. Track your plants, get care reminders, and watch your garden thrive.
                    </p>
                    <div className="space-x-4">
                        <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold text-lg transition shadow-lg inline-block">
                            Start Gardening Free
                        </Link>
                        <Link to="/plants" className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-3 rounded-full font-semibold text-lg transition shadow-md border border-gray-200 inline-block">
                            Explore Plants
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-10">
                        <Link to="/plants" className="block text-center p-6 rounded-xl border border-gray-100 hover:shadow-xl transition hover:-translate-y-1 bg-white">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <Sprout size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Plant Database</h3>
                            <p className="text-gray-600">Access comprehensive care guides for thousands of plant species.</p>
                        </Link>
                        <Link to="/reminders" className="block text-center p-6 rounded-xl border border-gray-100 hover:shadow-xl transition hover:-translate-y-1 bg-white">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                <Droplets size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Smart Reminders</h3>
                            <p className="text-gray-600">Never forget to water or fertilize again with automated schedules.</p>
                        </Link>
                        <Link to="/dashboard" className="block text-center p-6 rounded-xl border border-gray-100 hover:shadow-xl transition hover:-translate-y-1 bg-white">
                            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                                <Sun size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Growth Tracking</h3>
                            <p className="text-gray-600">Keep a visual log of your garden's active progress over time.</p>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

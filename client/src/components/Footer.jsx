import { Leaf, Mail, Github, Twitter, Heart, TrendingUp, Bell, BookOpen, Trophy } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-green-900 to-green-800 text-white mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <Leaf className="text-green-300 mr-2" size={32} />
                            <h3 className="text-2xl font-bold">GardenGuru</h3>
                        </div>
                        <p className="text-green-100 mb-4">
                            Your personal gardening companion. Track, grow, and nurture your plants with smart reminders,
                            detailed care guides, and a gamified growth system.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-green-300 hover:text-white transition">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-green-300 hover:text-white transition">
                                <Github size={20} />
                            </a>
                            <a href="#" className="text-green-300 hover:text-white transition">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="/dashboard" className="text-green-100 hover:text-white transition">My Garden</a></li>
                            <li><a href="/plants" className="text-green-100 hover:text-white transition">Plant Library</a></li>
                            <li><a href="/reminders" className="text-green-100 hover:text-white transition">Reminders</a></li>
                            <li><a href="/resources" className="text-green-100 hover:text-white transition">Resources</a></li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">Features</h4>
                        <ul className="space-y-2 text-green-100">
                            <li className="flex items-center"><TrendingUp size={16} className="mr-2" /> Growth Tracking</li>
                            <li className="flex items-center"><Bell size={16} className="mr-2" /> Smart Reminders</li>
                            <li className="flex items-center"><BookOpen size={16} className="mr-2" /> Care Guides</li>
                            <li className="flex items-center"><Trophy size={16} className="mr-2" /> Gamification</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200">
                    <p className="flex items-center justify-center">
                        Made with <Heart className="mx-2 text-red-400" size={16} fill="currentColor" /> by GardenGuru Team
                    </p>
                    <p className="mt-2 text-sm">
                        © {currentYear} GardenGuru. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

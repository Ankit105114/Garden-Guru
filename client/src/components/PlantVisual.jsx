import { Sprout, TreeDeciduous, Flower2 } from 'lucide-react';

const PlantVisual = ({ stage, size = 64 }) => {
    const getVisual = () => {
        switch (stage) {
            case 'Seed':
                return (
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-amber-700 border-2 border-amber-800" title="Seed"></div>
                        <div className="w-12 h-1 bg-amber-900/20 rounded-full mt-2"></div>
                    </div>
                );
            case 'Sprout':
                return (
                    <div className="flex flex-col items-center animate-bounce-slow">
                        <Sprout size={size} className="text-lime-500" strokeWidth={1.5} />
                        <div className="w-16 h-1.5 bg-amber-900/20 rounded-full mt-1"></div>
                    </div>
                );
            case 'Sapling':
                return (
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <Sprout size={size * 1.5} className="text-green-500" strokeWidth={2} />
                            <div className="absolute -top-2 right-0 w-3 h-3 bg-yellow-400 rounded-full animate-pulse opacity-50"></div>
                        </div>
                        <div className="w-20 h-2 bg-amber-900/20 rounded-full mt-1"></div>
                    </div>
                );
            case 'Tree':
            case 'Mature':
                return (
                    <div className="flex flex-col items-center">
                        <TreeDeciduous size={size * 2} className="text-emerald-600" strokeWidth={2} />
                        <div className="w-32 h-3 bg-amber-900/20 rounded-full mt-2"></div>
                    </div>
                );
            default:
                return <Flower2 size={size} className="text-pink-500" />;
        }
    };

    return (
        <div className="transition-all duration-500 ease-in-out transform hover:scale-105">
            {getVisual()}
            <p className="text-center font-bold text-gray-500 mt-2 uppercas tracking-wider text-xs">{stage}</p>
        </div>
    );
};

export default PlantVisual;

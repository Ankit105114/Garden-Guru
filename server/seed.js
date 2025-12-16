const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plant = require('./models/Plant');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gardenguru')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const plants = [
    {
        name: 'Tomato',
        scientificName: 'Solanum lycopersicum',
        waterFrequency: 'Every 2-3 days',
        sunlight: 'Full Sun',
        fertilizer: 'Balanced fertilizer every 2 weeks',
        pests: 'Aphids, Hornworms',
        imageUrl: 'https://images.unsplash.com/photo-1592841200221-a682ac6c0263?w=800&q=80'
    },
    {
        name: 'Basil',
        scientificName: 'Ocimum basilicum',
        waterFrequency: 'Every day',
        sunlight: 'Full Sun to Partial Shade',
        fertilizer: 'High nitrogen fertilizer every month',
        pests: 'Aphids, Slugs',
        imageUrl: 'https://images.unsplash.com/photo-1618375531912-867984bdf9d6?w=800&q=80'
    },
    {
        name: 'Monstera',
        scientificName: 'Monstera deliciosa',
        waterFrequency: 'Every 1-2 weeks',
        sunlight: 'Bright Indirect Light',
        fertilizer: 'Balanced liquid fertilizer monthly',
        pests: 'Spider mites, Scale',
        imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80'
    },
    {
        name: 'Snake Plant',
        scientificName: 'Dracaena trifasciata',
        waterFrequency: 'Every 2-3 weeks',
        sunlight: 'Low to Bright Indirect Light',
        fertilizer: 'All-purpose plant food twice a year',
        pests: 'Mealybugs',
        imageUrl: 'https://images.unsplash.com/photo-1599598425947-8109bf4397de?w=800&q=80'
    },
    {
        name: 'Aloe Vera',
        scientificName: 'Aloe barbadensis miller',
        waterFrequency: 'Every 3 weeks',
        sunlight: 'Bright Direct Light',
        fertilizer: 'Succulent fertilizer once a year',
        pests: 'Snails, Aphids',
        imageUrl: 'https://images.unsplash.com/photo-1628864700057-36e6761fa0da?w=800&q=80'
    },
    {
        name: 'Peace Lily',
        scientificName: 'Spathiphyllum',
        waterFrequency: 'Every week',
        sunlight: 'Low to Medium Light',
        fertilizer: 'Balanced fertilizer every 6 weeks',
        pests: 'Spider mites',
        imageUrl: 'https://images.unsplash.com/photo-1593482885934-803fc52f5af6?w=800&q=80'
    },
    {
        name: 'Fiddle Leaf Fig',
        scientificName: 'Ficus lyrata',
        waterFrequency: 'Every 1-2 weeks',
        sunlight: 'Bright Indirect Light',
        fertilizer: 'High nitrogen fertilizer monthly',
        pests: 'Spider mites, Scale',
        imageUrl: 'https://images.unsplash.com/photo-1616690248206-7e90dc2bb55a?w=800&q=80'
    },
    {
        name: 'Pothos',
        scientificName: 'Epipremnum aureum',
        waterFrequency: 'Every 1-2 weeks',
        sunlight: 'Low to Bright Light',
        fertilizer: 'Balanced fertilizer every month',
        pests: 'Mealybugs',
        imageUrl: 'https://images.unsplash.com/photo-1596720520638-c62529ad5922?w=800&q=80'
    },
    {
        name: 'Lavender',
        scientificName: 'Lavandula',
        waterFrequency: 'Every 2-3 weeks',
        sunlight: 'Full Sun',
        fertilizer: 'Low nitrogen fertilizer once a year',
        pests: 'Whiteflies, Spittlebugs',
        imageUrl: 'https://images.unsplash.com/photo-1592187652399-6f91d8302f3a?w=800&q=80'
    },
    {
        name: 'Spider Plant',
        scientificName: 'Chlorophytum comosum',
        waterFrequency: 'Every week',
        sunlight: 'Bright Indirect Light',
        fertilizer: 'General purpose fertilizer every month',
        pests: 'Spider mites, Aphids',
        imageUrl: 'https://images.unsplash.com/photo-1572688484238-80e2270942e5?w=800&q=80'
    }
];

const seedDB = async () => {
    try {
        await Plant.deleteMany({});
        await Plant.insertMany(plants);
        console.log('Database seeded!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();

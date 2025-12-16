import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { format } from 'date-fns';
import { Droplet, Syringe, Scissors, Sprout, Trash2, CheckCircle, Circle } from 'lucide-react';

const CalendarView = () => {
    const [date, setDate] = useState(new Date());
    const [reminders, setReminders] = useState([]);
    const [garden, setGarden] = useState([]);
    const [libraryPlants, setLibraryPlants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedId, setSelectedId] = useState(''); // ID of selected item
    const [reminderType, setReminderType] = useState('Water');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [remindersRes, gardenRes, plantsRes] = await Promise.all([
                axios.get('http://localhost:5001/api/reminders'),
                axios.get('http://localhost:5001/api/garden'),
                axios.get('http://localhost:5001/api/plants')
            ]);
            setReminders(remindersRes.data);
            setGarden(gardenRes.data);
            setLibraryPlants(plantsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddReminder = async (e) => {
        e.preventDefault();
        if (!selectedId) return alert('Please select a plant');

        try {
            let gardenItemId = selectedId;

            // Check if selected ID is a Garden Item or a Library Plant
            const existingGardenItem = garden.find(g => g._id === selectedId);

            // If NOT in garden, assuming it is a Library Plant ID -> Add to garden first
            if (!existingGardenItem) {
                const libraryPlant = libraryPlants.find(p => p._id === selectedId);
                if (libraryPlant) {
                    // Auto-add to garden
                    const addRes = await axios.post('http://localhost:5001/api/garden', {
                        plantId: libraryPlant._id,
                        nickname: libraryPlant.name,
                        notes: 'Added via Reminders',
                        stage: 'Seed'
                    });

                    gardenItemId = addRes.data._id;
                    // Update local garden state so next time it shows as "My Garden"
                    setGarden([...garden, addRes.data]);
                } else {
                    return alert('Invalid selection');
                }
            }

            const res = await axios.post('http://localhost:5001/api/reminders', {
                gardenItemId: gardenItemId,
                type: reminderType,
                date: date
            });
            setReminders([...reminders, res.data]);
            setShowAddForm(false);
            setSelectedId('');
        } catch (err) {
            console.error(err);
            alert('Failed to add reminder');
        }
    };

    const toggleComplete = async (id) => {
        try {
            const res = await axios.put(`http://localhost:5001/api/reminders/${id}`);
            setReminders(reminders.map(r => r._id === id ? res.data : r));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteReminder = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/reminders/${id}`);
            setReminders(reminders.filter(r => r._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // Helper to find reminders for a specific date
    const getRemindersForDate = (d) => {
        return reminders.filter(r =>
            new Date(r.date).toDateString() === d.toDateString()
        );
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dayReminders = getRemindersForDate(date);
            if (dayReminders.length > 0) {
                return (
                    <div className="flex justify-center mt-1 space-x-1">
                        {dayReminders.some(r => r.type === 'Water') && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        {dayReminders.some(r => r.type === 'Fertilizer') && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                        {dayReminders.some(r => r.type === 'Medicine') && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                    </div>
                );
            }
        }
    };

    const selectedDateReminders = getRemindersForDate(date);

    if (loading) return <div>Loading calendar...</div>;

    // Filter library plants to exclude ones that are conceptually already linked? 
    // Actually simplicity is better: just show everything. User can pick what they want.
    // If they pick "Rose" from library, we add a query.

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Garden Schedule</h2>
                <Calendar
                    onChange={setDate}
                    value={date}
                    tileContent={tileContent}
                    className="w-full border-none shadow-sm rounded-lg p-4 font-sans"
                />
                <style>{`
          .react-calendar { width: 100%; border: none; font-family: inherit; }
          .react-calendar__tile { padding: 1em 0.5em; height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; }
          .react-calendar__tile--active { background: #10B981 !important; color: white; }
          .react-calendar__tile--now { background: #ECFDF5; }
        `}</style>
            </div>

            <div className="lg:w-1/3 space-y-6">
                {/* Selected Date Header */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{format(date, 'MMMM d, yyyy')}</h3>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="text-sm bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark transition"
                        >
                            + Add Task
                        </button>
                    </div>

                    {/* Add Form */}
                    {showAddForm && (
                        <form onSubmit={handleAddReminder} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Plant</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={selectedId}
                                    onChange={e => setSelectedId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose Plant --</option>

                                    <optgroup label="My Garden">
                                        {garden.map(g => (
                                            <option key={g._id} value={g._id}>{g.nickname || g.plant?.name || 'Unknown Plant'}</option>
                                        ))}
                                    </optgroup>

                                    <optgroup label="Add from Library">
                                        {libraryPlants.map(p => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </optgroup>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Selecting from Library will add it to your garden.</p>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={reminderType}
                                    onChange={e => setReminderType(e.target.value)}
                                >
                                    <option value="Water">Watering</option>
                                    <option value="Fertilizer">Fertilizer</option>
                                    <option value="Medicine">Medicine</option>
                                    <option value="Pruning">Pruning</option>
                                    <option value="Harvesting">Harvesting</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark">Save Reminder</button>
                        </form>
                    )}

                    {/* Reminders List */}
                    <div className="space-y-3">
                        {selectedDateReminders.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No tasks for this day.</p>
                        ) : (
                            selectedDateReminders.map(reminder => (
                                <div key={reminder._id} className={`flex items-center justify-between p-3 rounded-lg border ${reminder.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100 shadow-sm'}`}>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => toggleComplete(reminder._id)} className={reminder.completed ? "text-green-500" : "text-gray-400 hover:text-green-500"}>
                                            {reminder.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                                        </button>
                                        <div>
                                            <p className={`font-semibold ${reminder.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                                {reminder.type}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {reminder.gardenItem?.nickname || reminder.gardenItem?.plant?.name || 'Unknown Plant'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        {reminder.type === 'Water' && <Droplet size={16} className="text-blue-400" />}
                                        {reminder.type === 'Fertilizer' && <Sprout size={16} className="text-green-500" />}
                                        {reminder.type === 'Medicine' && <Syringe size={16} className="text-red-400" />}
                                        {reminder.type === 'Pruning' && <Scissors size={16} className="text-orange-400" />}

                                        <button onClick={() => deleteReminder(reminder._id)} className="ml-3 text-gray-400 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;

import CalendarView from '../components/CalendarView';

const Reminders = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Smart Reminders</h1>
            <p className="text-gray-600 mb-8">
                Keep your garden healthy with automated schedules and to-dos.
            </p>
            <CalendarView />
        </div>
    );
};

export default Reminders;

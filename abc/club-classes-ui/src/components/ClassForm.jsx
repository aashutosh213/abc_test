import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ClassForm = ({ onSubmit, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [startDate, setStartDate] = useState(initialData?.startDate || '');
    const [endDate, setEndDate] = useState(initialData?.endDate || '');
    const [startTime, setStartTime] = useState(initialData?.startTime || '');
    const [duration, setDuration] = useState(initialData?.duration || '');
    const [capacity, setCapacity] = useState(initialData?.capacity || 1);
    const [active, setActive] = useState(initialData?.active || true);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, startDate, endDate, startTime, duration, capacity, active });
        setName('');
        setStartDate('');
        setEndDate('');
        setStartTime('');
        setDuration('');
        setCapacity(1);
        setActive(true);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 flex justify-content-center">
            <div className="form-group">
                <label>Class Name</label>
                <input
                    type="text"
                    placeholder="Class Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    maxLength={256}
                    required
                />
            </div>
            <div className="form-group">
                <label>Start Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-control w-50"
                    required
                />
            </div>
            <div className="form-group">
                <label>End Date</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-control w-50"
                    required
                />
            </div>
            <div className="form-group">
                <label>Start Time</label>
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="form-control w-50"
                    required
                />
            </div>
            <div className="form-group">
                <label>Duration</label>
                <input
                    type="text"
                    placeholder="Duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="form-control w-50"
                    required
                />
            </div>
            <div className="form-group">
                <label>Capacity</label>
                <input
                    type="number"
                    placeholder="Capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="form-control w-50"
                    min="10"
                    required
                />
            </div>

            <div className="form-group">
             <label className='m-3'>
                <input
                 type="checkbox"
                 checked={active}
                 onChange={(e)=>setActive(e.target.checked)}
                 className="form-check-input"
                 required
                />
                Active
             </label>
            </div>
            <button type="submit" className="btn btn-primary">
                {initialData ? 'Update Class' : 'Create Class'}
            </button>
        </form>
    );
};

export default ClassForm;
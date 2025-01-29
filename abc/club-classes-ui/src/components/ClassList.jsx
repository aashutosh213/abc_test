import {React, useState} from 'react';

const ClassList = ({ classes, onEdit, onDelete, isActive }) => {

    const [active, setActive] = useState(true); 

  const handleDropdownChange = (value) => {
    isActive(value);
    setActive(value);
  };
    return (
        <div>
        <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {active ? "Active" : "Inactive"}
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => handleDropdownChange(true)}
          >
            Active
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => handleDropdownChange(false)}
          >
            Inactive
          </button>
        </li>
      </ul>
    </div>
            <h2 className="text-xl font-bold">Classes</h2>
            <ul className="list-group mt-3">
                {classes.map((cls, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5>{cls.name}</h5>
                            <p>
                                Start Date: {cls.startDate} <br />
                                End Date: {cls.endDate} <br />
                                Start Time: {cls.startTime} <br />
                                Duration: {cls.duration} <br />
                                Capacity: {cls.capacity}<br />
                                Active: {cls.active.toString()}
                            </p>
                        </div>
                        <div>
                            <button onClick={() => onEdit(index)} className="btn btn-warning btn-sm me-2">Edit</button>
                            <button onClick={() => onDelete(index)} className="btn btn-danger btn-sm">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClassList;
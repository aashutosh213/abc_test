import React, { useState, useEffect, useCallback } from 'react';
import ClassForm from './components/ClassForm';
import ClassList from './components/ClassList';
import { toast, ToastContainer } from 'react-toastify';

const App = () => {
    const [classes, setClasses] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showAddClass, setShowAddClass] = useState(true);
    const [active, setActive] = useState("True");

    const fetchClasses = async () => {
      try{
      let response = await fetch(`http://localhost:3001/api/createClasses/classes?pageNum=1&pageSize=10000&isActive=${active}`);
      let data = await response.json();
      setClasses(data.classes);
      }catch(err){
        setClasses([]);
        console.error("failed to fetch level");
      }
  };

  const postClass = async (classData) => {
    try{
    let response = await fetch('http://localhost:3001/api/createClasses/classes', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(classData),
  });
  var resp = await response.json();
  if(response.status === 400){
    toast.error(`Failed to post the class: ${resp.error}`);
    return false;
  }else if(response.status === 200){
    toast.success("Successfully saved the class");
    return true;
  }else{
    toast.error("Failed to post the class");
    return false;
  }
}catch(err){
  toast.error("Server Error: Failed to post the class");
  console.error("failed to post the class", err);
  return false;
}

  }

  const updateClass = async (classData) => {
    try{
    let response = await fetch(`http://localhost:3001/api/createClasses/classes/${classData._id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(classData),
  });
  var resp = await response.json();
  if(response.status === 400){
    toast.error(`Failed to update the class: ${resp.error}`);
    return false;
  }else if(response.status === 200){
    toast.success("Successfully updated the class");
    return true;
  }else{
    toast.error("Failed to update the class");
    return false;
  }
}catch(err){
  toast.error("Server Error: Failed to update the class");
  console.error("failed to post the class", err);
  return false;
}

  }

  const handleDelete = async (classData) => {
    try{
    var response = await fetch(`http://localhost:3001/api/createClasses/classes/${classData._id}`, {
        method: 'DELETE',
    });
    var resp = await response.json();
  if(response.status === 400){
    toast.error(`Failed to delete the class: ${resp.error}`);
    return false;
  }else if(response.status === 200){
    toast.success("Successfully deleted the class");
    return true;
  }else{
    toast.error("Failed to delete the class");
    return false;
  }
  }catch(err){
    toast.error("Server Error: Failed to delete class");
    console.error("failed to deleet the class",  err);
    return false;
  }
};

    const handleAddOrUpdateClass = async (classData) => {
        if (editingIndex !== null) {
            var res = await updateClass(classData);
            if(res){
              const updatedClasses = classes.map((cls, index) => (index === editingIndex ? classData : cls));
              setClasses(updatedClasses);
            }
            setEditingIndex(null);
        } else {
           const res = await postClass(classData);
            if(res){
              setClasses([...classes, classData]);
            }
        }
    };

    const handleEditClass = (index) => {
        setEditingIndex(index);
        setShowAddClass(true);
    };

    const handleDeleteClass = async (index) => {
      //handle Delete from abckend
        var res = await handleDelete(classes[index]);
        if(res){
          const updatedClasses = classes.filter((_, i) => i !== index);
          setClasses(updatedClasses);
        }
    };

    const handleShowClass = ()=>{
      setShowAddClass(false);
      setEditingIndex(null);
    }
    const handleActive = (value)=>{
      console.log(value);
       if(!value){
          setActive("True")
        } else {
          setActive("False");
        }
        console.log(active);
       fetchClasses();
    }

    useEffect(() => {
      fetchClasses();
    },[]);

    return (
        <div className="container mt-5">
            <h1 className="text-center">Club Classes Management</h1>
            <ul className="nav nav-pills mb-4 justify-content-center align-items-center d-flex ">
        <li className="nav-item">
          <button
            className={`nav-link ${showAddClass ? "active" : ""}`}
            onClick={() => setShowAddClass(true)}
          >
            Add Class
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${!showAddClass ? "active" : ""}`}
            onClick={() => handleShowClass()}
          >
            Show Classes
          </button>
        </li>
      </ul>
      <div className="card p-4">
        { showAddClass ? 
          <ClassForm onSubmit={handleAddOrUpdateClass} initialData={editingIndex !== null ? classes[editingIndex] : null} />
          :
          <ClassList classes={classes} onEdit={handleEditClass} onDelete={handleDeleteClass} isActive={handleActive}/>
        }
      </div>
            
            
            <ToastContainer/>
        </div>
    );
};

export default App;
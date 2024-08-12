import React from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({ noteData, type, onclose, getAllNotes, handleShowToast }) => {
  const [title, setTitle] = React.useState(noteData?.title || "");
  const [content, setContent] = React.useState(noteData?.content || "");
  const [tags, setTags] = React.useState(noteData?.tags || []);
  const [error, setError] = React.useState(null);


  const addNewNote = async() => {
    try {
      const response = await axiosInstance.post('/add-note', {
        title,
        content,
        tags,
      });
      if(response.status === 200) {
        handleShowToast({ message: "Note added successfully", type: "add" });
        getAllNotes()
        onclose() 
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      
    }
  }

  const editNote = async() => {
    const noteId = noteData?._id;
    try {
      const response = await axiosInstance.put('/edit-note/' + noteId, {
        title,
        content,
        tags,
      });
      if(response.status === 200) {
        handleShowToast({ message: "Note edited successfully", type: "edit" });
        getAllNotes()
        onclose() 
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      
    }
  }

  const handleAddNote = () => {
    if (!title || !content) {
      setError("Please fill all the fields");
      return;
    }
    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
      onclose()
    }
  };

  return (
    <div className="relative">
      <button
        className=" w-10 h-10 rounded-full flex items-center justify-center absolute -top-4 -right-4 hover:bg-gray-400"
        onClick={onclose}
      >
        <MdClose className="text-xl text-gray-500" />
      </button>
      <div className="flex flex-col gap-2">
        <label htmlFor="notes" className="input-label">
          TITLE
        </label>
        <input
          type="text"
          className="text-2xl text-gray-800 bg-gray-50/40 outline-none"
          placeholder="Go to study after lunch"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4 ">
        <label htmlFor="notes" className="input-label">
          CONTENT
        </label>
        <textarea
          type="text"
          className="text-sm p-2 text-gray-700 bg-gray-50 outline-none"
          placeholder="content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="" className="input-label">
          TAGS
        </label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-sm  ">{error}</p>}

      <div className=" flex flex-col mt-2">
        <button className="btn-primary font-medium p-2" onClick={handleAddNote}>
          {type === "edit"? "UPDATE" : "ADD"}
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;

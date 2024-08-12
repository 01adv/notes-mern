import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import AddEditNotes from "./AddEditNotes";
import Toast from "../../components/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

const Home = () => {
  const [openEditModal, setOpenEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [userInfo, setUserInfo] = useState(null);

  const [allNotes, setAllNotes] = useState([]);

  const navigate = useNavigate();

  //edit note
  const handleEdit = (noteDetails) => {
    setOpenEditModal({ isShown: true, type: "edit", data: noteDetails });
  };

  //toast handle
  const handleShowToast = ({ message, type }) => {
    setShowToastMsg({ isShown: true, message, type });
  };
  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "", type: "add" });
  };

  //get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.log(error);
      }
    }
  };

  // get all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // delete note
  const deleteNote = async (data) =>{
    
    try {
      const response = await axiosInstance.delete('/delete-note/' + data);
      if(response.status === 200) {
        handleShowToast({ message: "Note deleted successfully", type: "delete" });
        getAllNotes()
        onclose() 
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message) {
        console.log("An unexpected error occurred. Please try again.");

      }
      
    }
  }

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto lg:px-16">
        {allNotes.length > 0 ? (

          <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes?.map((item, index) => (
            <NoteCard
            key={item._id}
            title={item.title}
            date={item.createdAt}
            content={item.content}
            tags={item.tags}
            isPinned={item.isPinned}
            onEdit={() => handleEdit(item)}
            onDelete={() => deleteNote(item._id)}
            onPinNote={() => {}}
            />
          ))}
        </div>
        ):
        (<EmptyCard imgSrc={''} message={''}/>)}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10 "
        onClick={() => {
          setOpenEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        }}
        contentLabel=""
        className=" w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
        ariaHideApp={false}
      >
        <AddEditNotes
          type={openEditModal.type}
          noteData={openEditModal.data}
          onclose={() => {
            setOpenEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          handleShowToast={handleShowToast}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onclose={handleCloseToast}
      />
    </>
  );
};

export default Home;

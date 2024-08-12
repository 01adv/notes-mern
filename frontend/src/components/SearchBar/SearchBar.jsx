import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-slate-100 rounded-full">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-xs bg-transparent py-2 outline-none"
        value={value}
        onChange={onChange}
      />
      {value && (
        <MdClose
          className="text-slate-500 text-xl cursor-pointer hover:text-black"
          onClick={onClearSearch}
        />
      )}

      
      <FaMagnifyingGlass
        className="text-slate-500 text-sm cursor-pointer hover:text-black"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;

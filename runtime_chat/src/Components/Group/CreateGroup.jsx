import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAddGroup from './UserAddGroup';
import NewGroup from './NewGroup';
import { useDispatch, useSelector } from 'react-redux';
import { searchUser } from '../../Redux/Auth/Action';
import { BASE_API_URL } from '../../config/Api';


const CreateGroup = ({ ReturnHome }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newGroup, setNewGroup] = useState(false);
  const [querys, setQuerys] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const token = localStorage.getItem("token");
  const { auth } = useSelector((state) => state);
  const [lstUserID, setlstUserID] = useState([]);

  const handleSearch = (keyword) => {
    dispatch(searchUser({ keyword, token }));
  };

  console.log("DANH SACH BAN BE : ");
  auth.searchUser.forEach((e) => console.log(e));



  const handleAddUser = (user) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
      setlstUserID([...lstUserID, user.id]);
    }
  };


  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
    setlstUserID(lstUserID.filter((id) => id !== userId));
  };


  const handleNewGroup = () => {
    setNewGroup(true);
  }


  return (
    <div>
      {newGroup && <NewGroup ReturnHome={ReturnHome} lstUserID={lstUserID} />}
      {!newGroup && (
        <div className="flex flex-col w-full h-[667px] text-black bg-white">
          <div className="flex items-center justify-between w-full px-4 py-4 shadow-md bg-gradient-to-r from-gray-400 to-gray-600">
            <button
              onClick={() => navigate(-1)}
              className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-300"
              aria-label="Back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>
            </button>
            <p className="text-lg font-medium">ADD GROUP</p>
          </div>

          {/* Search bar */}
          <div className="relative flex items-center justify-between gap-2 px-4 py-4 bg-gray-100 shadow-md">
            <div className="relative flex-1">
              <img
                className="absolute w-5 h-5 transform -translate-y-1/2 top-1/2 left-3"
                src="/src/assets/icon/search.png"
                alt="Search icon"
              />
              <input
                className="w-full py-2 pl-10 pr-4 text-black bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Search or start new chat..."
                value={querys}
                onChange={(e) => {
                  setQuerys(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </div>
            <button className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-300">
              <img
                className="w-6 h-6"
                src="/src/assets/icon/filter.png"
                alt="Filter icon"
              />
            </button>
          </div>

          {/* Selected users */}
          {selectedUsers.length > 0 && (
            <div className="px-3 py-2 overflow-y-auto bg-gray-100 shadow-inner max-h-20">
              <div className="flex gap-2 flex-nowrap">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center px-2 py-1 text-black bg-gray-200 rounded-full min-w-fit"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        className="w-6 h-6 rounded-full"
                        src={`${BASE_API_URL}/uploads/${user.profilePicture}`}
                        alt={user.fullname}
                      />
                      <span className="text-xs">{user.fullname}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveUser(user.id);
                      }}
                      className="ml-1 text-gray-600 hover:text-black"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User list */}
          <div className="flex-1 px-4 py-3 bg-white max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 space-y-3">
            {querys && (
              Array.isArray(auth.searchUser) && auth.searchUser.length > 0 ? (
                auth.searchUser
                  .filter((item) => item.id !== auth.reqUser?.id) 
                  .map((item) => (
                    <div key={item.id} onClick={() => handleAddUser(item)}>
                      <UserAddGroup user={item} />
                    </div>
                  ))
              ) : (
                <div><h2 className='text-center font-extralight'>Không có kết quả</h2></div>
              )
            )}


          </div>

          {/* Create group button */}
          <div className="sticky bottom-0 px-4 py-4 bg-gray-100 shadow-md">
            <button
              onClick={handleNewGroup}
              disabled={selectedUsers.length === 0}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${selectedUsers.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
              Create Group
            </button>
          </div>
        </div>
      )}
    </div>
  );

};

export default CreateGroup;

import React, { useEffect, useState } from "react";
import { Modal, Input, Button } from "@nextui-org/react";
import { FiEdit } from "react-icons/fi";
import { SearchResultType, UserType } from "../../utils/type";
import SearchResult from "../SearchResult/SearchResult";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { asyncUserSearch, resetSearchUser } from "../../store/authSlice";
import { ImCross } from "react-icons/im";
import { asyncChatCreate } from "../../store/chatSlice";

export default function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  const searchUserResult = useSelector(
    (state: RootState) => state.auth.userSearchResult
  );
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [searchResult, setSearchResult] = useState<UserType[]>([]);
  const [groupMember, setGroupMember] = useState<UserType[]>([]);

  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
  };

  const handleCreate = () => {
    dispatch(asyncChatCreate({groupMember, groupName}) as any)
    setVisible(false)
  }

  useEffect(() => {
    if (search) {
      dispatch(asyncUserSearch(search) as any);
    } else {
      dispatch(resetSearchUser() as any);
    }
  }, [search, dispatch]);

  useEffect(() => {
    setSearchResult(searchUserResult);
  }, [searchUserResult]);

  useEffect(() => {
    setSearch("")
  }, [groupMember])

  const handleMemberDelete = (id: string) => {
    const temp = groupMember.filter(item => item._id !== id)
    setGroupMember(temp)
  }

  return (
    <div>
      <button className="border-none outline-none" onClick={handler}>
        <FiEdit
          title="Create a group"
          className="text-primary font-extrabold cursor-pointer"
          size={25}
        />
      </button>
      <Modal
        width="500px"
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <h1 className="text-lg font-bold">
            Create A <span className="text-xl text-primary">Group</span>
          </h1>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-60">
            <div className="relative">
            <Input
                shadow
                placeholder="Group Name"
                width="100%"
                value={groupName}
                className="mb-4"
                onChange={(e) => setGroupName(e.target.value)}
              ></Input>
              <Input
                shadow
                placeholder="Search an user"
                width="100%"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
              <div
                className={`absolute w-full bg-gray-100 scale-y-0  origin-top h-fit shadow-lg top-[102%] py-2 pb-4 rounded-md transition-all duration-200 ease-in-out ${
                  search && "scale-y-100"
                }`}
              >
                {searchResult.length > 0 && search ? (
                  searchResult.map((item: SearchResultType) => {
                    if (item._id === user._id) return null;
                    return (
                      <SearchResult
                        key={item._id}
                        search={item}
                        groupMember={groupMember}
                        setGroupMember={setGroupMember}
                        setSearch={setSearch}
                      />
                    );
                  })
                ) : (
                  <h1 className="text-black text-sm text-center font-bold">
                    No User Found
                  </h1>
                )}
              </div>
            </div>
            <div className=" w-full p-2 py-4 flex items-center flex-wrap space-x-3">
              {groupMember.map((item, index) => (
                <button className="flex items-center mt-2" key={index}>
                  <span className="p-1 px-2 font-bold text-sm bg-gray-300">@{item.username}</span>
                  <span className="p-2 bg-red-500 text-white" onClick={() => handleMemberDelete(item._id)}>
                    <ImCross size={15} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Close
          </Button>
          <Button auto disabled={groupMember.length < 2 || groupName.length === 0} onClick={handleCreate}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

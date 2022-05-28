import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { SearchResultType } from "../../utils/type";
import ConversationList from "../ConversationList/ConversationList";
import SearchResult from "../SearchResult/SearchResult";
import GroupCreate from '../GroupCreate/GroupCreate'
import { asyncUserSearch, resetSearchUser } from "../../store/authSlice";
import { asyncChatSingleCreate } from "../../store/chatSlice";

export default function Leftside() {
  const user = useSelector((state: RootState) => state?.auth.user);
  const searchResult = useSelector((state: RootState) => state.auth.userSearchResult)
  const dispatch = useDispatch()
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search) {
      dispatch(asyncUserSearch(search) as any);
    } else {
      dispatch(resetSearchUser() as any);
    }
  }, [search, dispatch]);


  const startConversation = (id: string) => {
    dispatch(asyncChatSingleCreate(id) as any)
    dispatch(resetSearchUser() as any);
    setSearch("")
  }

  return (
    <div className="p-4 text-neutral w-80 overflow-y-auto scrollbar-thin relative">
      <div className="sticky top-0 bg-white pb-2 border-b shadow-sm z-50">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-2xl">Messages</h1>
          <GroupCreate />
        </div>
        <div className="flex items-center mt-4 bg-gray-100 p-2 rounded-lg">
          <AiOutlineSearch size={22} className="text-gray-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search"
            className="w-full text-sm outline-none border-none bg-transparent ml-1"
          />
        </div>
        {/* Search popup box */}
        <div
          className={`absolute w-full bg-gray-100 scale-y-0 origin-top h-fit shadow-lg top-[102%] py-2 pb-4 rounded-md transition-all duration-200 ease-in-out ${
            search && "scale-y-100"
          }`}
        >
          {searchResult.length > 0 && search ? (
            searchResult.map((item: SearchResultType) => {
              if (item._id === user._id) return null;
              return <div key={item._id} onClick={() => startConversation(item._id)}><SearchResult search={item} /></div>;
            })
          ) : (
            <h1 className="text-black text-sm text-center font-bold">
              No User Found
            </h1>
          )}
        </div>
      </div>
      <div className="relative">
        <ConversationList />
      </div>
    </div>
  );
}

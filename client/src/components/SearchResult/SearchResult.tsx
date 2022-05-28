import React from 'react'
import { SearchResultType, UserType } from "../../utils/type";

export default function SearchResult({ search, groupMember, setGroupMember, setSearch }: PropsType) {

  const addMember = () => {
    if(setGroupMember && groupMember && setSearch) {
      let temp = [...groupMember]
      if(temp.findIndex(item => item._id === search._id) === -1) {
        temp.push(search)
      }
      setGroupMember(temp)
      setSearch("")
    }
  }

  return (
    <div className="flex items-center mt-3 cursor-pointer group hover:bg-primary p-2" onClick={addMember}>
      {search.profilePic ? (
        <img
          src={search.profilePic}
          className="w-12 h-12 rounded-full object-cover object-center"
          alt=""
        />
      ) : (
        <span className="w-12 h-12 rounded-full font-bold text-xl bg-neutral text-white grid place-items-center">{search.name[0].toUpperCase()}</span>
      )}
      <div className="ml-2 font-semibold">
        <h1 className="capitalize">{search.name}</h1>
        <p className="text-gray-400 group-hover:text-white">@{search.username}</p>
      </div>
    </div>
  );
}

interface PropsType {
  search: SearchResultType,
  groupMember ?: UserType[],
  setGroupMember ?: React.Dispatch<React.SetStateAction<UserType[]>>,
  setSearch ?: React.Dispatch<React.SetStateAction<string>>
}
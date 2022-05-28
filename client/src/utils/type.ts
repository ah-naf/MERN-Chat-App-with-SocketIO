export interface UserType {
  _id: string;
  profilePic: string;
  name: string;
  username: string;
}

export interface SearchResultType {
  name: string;
  profilePic: string;
  username: string;
  _id: string;
}

export interface CoversationType {
  users: UserType[],
  groupAdmin: UserType,
  _id: string,
  chatName: string,
  isGroupChat: Boolean,
  updatedAt: string,
  latestMessage ?: LatestMessageType
}

export interface LatestMessageType {
  sender: UserType,
  content: string,
}

export interface MessageType extends LatestMessageType {
  _id: string,
  updatedAt: string
}
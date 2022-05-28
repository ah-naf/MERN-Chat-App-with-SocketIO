import {BsPinAngleFill} from 'react-icons/bs'
import {RiMessage3Fill} from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import MessagePreview from '../MessagePreview/MessagePreview'

export default function PinnedMessages() {
  const conversations = useSelector((state: RootState) => state.chat.conversations)
  return (
    <div className='mt-4'>
        <div className='text-gray-400 flex items-center text-xs font-bold mb-1'>
            {false ? <BsPinAngleFill /> : <RiMessage3Fill />}
            <p className='ml-1'>{false ? 'PINNED' : "ALL MESSAGES"}</p>
        </div>
        <div className='flex flex-col'>
          {conversations.map((item, index) => (
            <MessagePreview key={index} chat={item} />
          ))}
        </div>
    </div>
  )
}

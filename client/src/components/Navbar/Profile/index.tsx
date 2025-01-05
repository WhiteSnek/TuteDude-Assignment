import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/types/user.types'
import React from 'react'

interface ProfileProps {
    user: User
}

const Profile:React.FC<ProfileProps> = ({user}) => {
  return (
    <Avatar>
              <AvatarImage src={user.avatar} alt={user.fullname} />
              <AvatarFallback>{user.fullname[0]}</AvatarFallback>
            </Avatar>
  )
}

export default Profile

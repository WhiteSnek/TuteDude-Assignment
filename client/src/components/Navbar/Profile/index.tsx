import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'

interface ProfileProps {
    user: {
        name: string,
        avatarUrl: string
    }
}

const Profile:React.FC<ProfileProps> = ({user}) => {
  return (
    <Avatar>
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
  )
}

export default Profile

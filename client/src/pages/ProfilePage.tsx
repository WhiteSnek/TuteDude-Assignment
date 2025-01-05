import Profile from '@/components/Profile'
import React from 'react'
import { useParams } from 'react-router-dom'

const ProfilePage:React.FC = () => {
    const {userId} = useParams()
    if(!userId) return null
  return (
    <div>
      <Profile userId={userId} />
    </div>
  )
}

export default ProfilePage

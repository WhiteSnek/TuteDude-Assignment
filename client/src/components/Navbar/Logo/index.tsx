import React from 'react'
import { Link } from 'react-router-dom'

const Logo:React.FC = () => {
  return (
    <div className="text-2xl font-bold">
        <Link to={"/"}>PeerConnect</Link>
    </div>
  )
}

export default Logo

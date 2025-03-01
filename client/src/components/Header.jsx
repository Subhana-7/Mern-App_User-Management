import React from 'react'
import {Link} from 'react-router-dom'

const Header = () => {
  return (
    <div className='bg-cyan-300' >
      <div className='flex justify-between items-center max-w-6xl mx-auto p-5' >
        <Link to='/' >
        <h1 className='main-heading' >User Management</h1>
        </Link>
        <ul className='flex gap-4' >
          <Link  to='/' >
            <li>Home</li>
          </Link>
          <Link  to='/about' >
            <li>About</li>
          </Link>
          <Link  to='/login' >
            <li>Sign in</li>
          </Link>
          
        </ul>
      </div>
    </div>
  )
}

export default Header

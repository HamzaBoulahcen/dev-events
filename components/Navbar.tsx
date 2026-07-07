import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
        <header>
            <nav>
                <Link href='/' className="logo">
                    <img src="/icons/logo.png" alt="logo" width={24} height={24} />
                    <p>Dev Events</p>
                </Link>
                <ul>
                    <li>
                        <Link href='/'>Home</Link>
                    </li>
                    <li>
                        <Link href='/about'>Events</Link>
                    </li>
                    <li>
                        <Link href='/contact'>Create Event</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar
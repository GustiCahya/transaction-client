import React from 'react';
import './navbar.styles.scss';
import {Link} from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="blue darken-2">
            <div className="nav-wrapper container">
                <ul className="left">
                    <li><Link to="/">Transaksi</Link></li>
                    <li><Link to="/tiers">Tingkatan</Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    AiOutlineHome,
    AiOutlineUser
} from 'react-icons/ai';
import {
    FaMotorcycle,
    FaPallet
} from 'react-icons/fa';
import {
    RiBillFill
} from 'react-icons/ri';

const SideBar = () => {
    const [active, setActive] = useState('home')

    return (
        <div className="sidebar">
            <div className="sidebar__wrapper">
                <div className="sidebar__wrapper__menu">
                    <div className="menuTitle"> 
                        <Link to="/"><img src='/sunFlower.png' alt='logo' /></Link>
                    </div>
                    <ul className="menuList">
                        <Link to="/">
                            <li className={`menuList__item ${active === 'home' ? 'active' : ''}`} onClick={() => setActive('home')}>
                                <AiOutlineHome className="menuList__item-icon"/>
                                <span className="menuList__item-name">Home</span>
                            </li>
                        </Link>
                        <Link to="/customer">
                            <li className={`menuList__item ${active === 'users' ? 'active' : ''}`} onClick={() => setActive('users')}>
                                <AiOutlineUser className="menuList__item-icon"/>
                                <span className="menuList__item-name">Khách hàng</span>
                            </li>
                        </Link>
                        <Link to="/staff">
                            <li className={`menuList__item ${active === 'staff' ? 'active' : ''}`} onClick={() => setActive('staff')}>
                                <AiOutlineUser className="menuList__item-icon"/>
                                <span className="menuList__item-name">Nhân viên</span>
                            </li>
                        </Link>
                        <Link to="/products">
                            <li className={`menuList__item ${active === 'products' ? 'active' : ''}`} onClick={() => setActive('products')}>
                                <FaMotorcycle className="menuList__item-icon"/>
                                <span className="menuList__item-name">Xe Mo To</span>
                            </li>
                        </Link>
                        <Link to="/maintenance-service">
                            <li className={`menuList__item ${active === 'maintenance' ? 'active' : ''}`} onClick={() => setActive('maintenance')}>
                                <FaMotorcycle className="menuList__item-icon"/>
                                <span className="menuList__item-name">Bảo dưỡng</span>
                            </li>
                        </Link>
                        <Link to="/vehicle-registration">
                            <li className={`menuList__item ${active === 'registration' ? 'active' : ''}`} onClick={() => setActive('registration')}>
                                <FaMotorcycle className="menuList__item-icon"/>
                                <span className="menuList__item-name">Đăng ký xe</span>
                            </li>
                        </Link>
                        <Link to="/accessories">
                            <li className={`menuList__item ${active === 'accessories' ? 'active' : ''}`} onClick={() => setActive('accessories')}>
                                <FaPallet className="menuList__item-icon"/>
                                <span className="menuList__item-name">Phụ tùng</span>
                            </li>
                        </Link>
                        <Link to="/orders">
                            <li className={`menuList__item ${active === 'order' ? 'active' : ''}`} onClick={() => setActive('order')}>
                                <RiBillFill className="menuList__item-icon"/>
                                <span className="menuList__item-name">Đơn hàng</span>
                            </li>
                        </Link>
                    </ul>
                </div>


            </div>
        </div>
    )
}

export default SideBar

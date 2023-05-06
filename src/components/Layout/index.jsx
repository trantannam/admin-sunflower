import { Dialog, Menu, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
  Bars3BottomLeftIcon,
  BellIcon, ClipboardDocumentCheckIcon, HomeIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import { FaGifts } from 'react-icons/fa';
import { GiFlowerPot } from 'react-icons/gi';
import { TbJumpRope } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './layout.scss';

import { signout } from 'actions/userAction';
import BrandList from 'pages/Brand';
import Comment from 'pages/Comment';
import CreateProduct from 'pages/CreateProduct/CreateProduct';
import Home from 'pages/Home/Home';
import OrderDetail from 'pages/OrderDetail/OrderDetail';
import OrderList from 'pages/OrderList';

import Product from 'pages/Product/Product';
import ProductConfig from 'pages/ProductConfig';
import ProductList from 'pages/ProductList/ProductList';
import Promotion from 'pages/Promotion';
import PromotionDetail from 'pages/PromotionDetail';
import Reviews from 'pages/Reviews';
import StaffList from 'pages/StaffList';
import TimeService from 'pages/TimeService';
import CustomerList from 'pages/CustomerList';
import VehicleType from 'pages/VehicleType';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
  { name: 'Khách hàng', href: '/customer', icon: UsersIcon, current: false },
  { name: 'Nhân viên', href: '/staff', icon: UserGroupIcon, current: false },
  { name: 'Khuyến mãi', href: '/promotion', icon: FaGifts, current: false },
  { name: 'Sản phẩm', href: '/products', icon: GiFlowerPot, current: false },
  { name: 'Loại sản phẩm', href: '/vehicle-type', icon: TbJumpRope, current: false },
  { name: 'Đơn hàng', href: '/orders', icon: ClipboardDocumentCheckIcon, current: false },
]
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout(props) {
  const userNavigation = [
    { name: 'Đăng xuất', func: () => signOut() },
  ]
  const dispatch = useDispatch()
  
  function signOut () {
    dispatch(signout())
    return navigate('/login')
  }
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation();
  const { userSignin } = useSelector(state => state);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userSignin.name) {
      return navigate('/login')
    }
  }, [userSignin, navigate])
  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 text-xl flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pt-5 pb-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <Link to="/dashboard" className="flex flex-shrink-0 items-center px-4">
                    <img src='/sunFlower.png' alt='logo' />
                  </Link>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            pathname.includes(item.href)
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              pathname.includes(item.href) ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                              'mr-4 flex-shrink-0 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col bg-gray-600">
            <Link to="/dashboard" className="flex h-16 flex-shrink-0 items-center bg-white px-4">
              <img src='/sunFlower.png' alt='logo' />
            </Link>
            <div className="flex flex-1 flex-col overflow-y-auto">
              <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      pathname.includes(item.href) ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        pathname.includes(item.href) ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:pl-64" >
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 justify-between px-4">
              <div className="flex flex-1">
                <form className="flex w-full md:ml-0" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                      <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <input
                      id="search-field"
                      className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                      placeholder="Search"
                      type="search"
                      name="search"
                    />
                  </div>
                </form>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <div
                              onClick={item.func}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              {item.name}
                            </div>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6">
              <div className="body__container w-full">

                <Routes>
                  <Route path="/" element={<div className="bg-home"></div>} />
                  <Route path="/dashboard" element={<Home />} />
                  <Route path="/customer" element={<CustomerList />} />
                  <Route path="/staff" element={<StaffList />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/orders" element={<OrderList />} />
                  <Route path="/vehicle-type" element={<VehicleType />} />
                  <Route path="/promotion" element={<Promotion />} />
                  <Route path="/promotion/:code" element={<PromotionDetail />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/brands" element={<BrandList />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/product/config/:id" element={<ProductConfig />} />
                  <Route path="/create-product" element={<CreateProduct />} />
                  <Route path="/review/:id" element={<Reviews />} />
                  <Route path="/comment/:id" element={<Comment />} />
                  <Route path="/staff/time-service" element={<TimeService />} />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
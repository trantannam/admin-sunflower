import { signin } from "actions/userAction";
import axios from "axios";
import { useState } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]= useState({
    login_name: '',
    password: ''
  });
  const dispatch = useDispatch()

  const handLogin = (e) => {
    e.preventDefault();
    if(form.login_name && form.password) {
      axios.post('http://localhost:5000/staff/signin', form)
      .then(res=> {
        if(res.data.success) {
          dispatch(signin(res.data))
          toast.success("Đăng nhập thành công")
          return navigate('/dashboard')
        }
      })
    }
  }

  return (
    <div>
      <section className="h-screen">
        <div className="container px-6 py-12 h-full">
          <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
            <div className="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                className="w-full"
                alt="login_name"
              />
            </div>
            <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
              <h1 className="w-full text-center font-bold text-4xl mb-10">Đăng nhập trang quản trị hệ thống</h1>
              <form onSubmit={handLogin}>
                <div className="mb-6">
                  <input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    placeholder="login_name"
                    required
                    onChange={(e) => setForm(prev => ({...prev, login_name: e.target.value}))}
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="password"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    required
                    autoComplete="true"
                    placeholder="Password"
                    onChange={(e) => setForm(prev => ({...prev, password: e.target.value}))}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
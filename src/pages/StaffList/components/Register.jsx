import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Register(props) {
    const { setModal, refreshTable } = props;
    const [image, setImage] = useState(null);

    const [check, setCheck] = useState({})
    const [errorMessage, setErrorMessage] = useState({
        errorName: "",
        errorEmail: "",
        errorPassword: "",
        errorRePassword: "",
        errorPhone: ""
    })
    const formInit = {
        name: "",
        email: "",
        password: "",
        phone: "",
        confirmPassword: "",
        address: ""
    }
    const [formData, setFormData] = useState(formInit)
    const checkEmail = (value) => {
        // eslint-disable-next-line no-useless-escape
        const regexEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
        setFormData({ ...formData, email: value })
        if (regexEmail.test(value)) {
            setErrorMessage({ ...errorMessage, errorEmail: "" })
            setCheck({ ...check, email: true })
        } else {
            setCheck({ ...check, email: false })
            setErrorMessage({ ...errorMessage, errorEmail: "Email không hợp lệ!" })
        }
    }

    const checkPassword = (value) => {
        // eslint-disable-next-line no-useless-escape
        const regexPassAlphaLo = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
        setFormData({ ...formData, password: value })
        if (regexPassAlphaLo.test(value)) {
            setErrorMessage({ ...errorMessage, errorPassword: "" })
            setCheck({ ...check, password: true })
        } else {
            setCheck({ ...check, password: false })
            setErrorMessage({ ...errorMessage, errorPassword: "Mật khẩu phải có ít nhất 8 ký tự gồm số, chữ thường, hoa và ký tự đặc biệt!" })
        }
    }

    const checkRePassword = (value) => {
        setFormData({ ...formData, confirmPassword: value })
        if (value === formData.password) {
            setErrorMessage({ ...errorMessage, errorRePassword: '' })
            setCheck({ ...check, repassword: true })
        } else {
            setCheck({ ...check, repassword: false })
            setErrorMessage({ ...errorMessage, errorRePassword: 'Mật khẩu nhập lại không khớp' })
        }
    }
    const checkPhone = (value) => {
        // eslint-disable-next-line no-useless-escape
        const regexPhone = new RegExp(/^[0-9\-\+]{9,12}$/)
        setFormData({ ...formData, phone: value })
        if (regexPhone.test(value)) {
            setErrorMessage({ ...errorMessage, errorPhone: "" })
            setCheck({ ...check, phone: true })
        } else {
            setCheck({ ...check, phone: false })
            setErrorMessage({ ...errorMessage, errorPhone: "Số điện thoại không hợp lệ" })
        }
    }
    const checkNull = (id, value) => {
        setFormData({ ...formData, [id]: value })
        if (value) {
            setCheck({ ...check, [id]: true })
        } else {
            setCheck({ ...check, [id]: false })
        }
    }

    function FormError(props) {
        if (props.isHidden) return (<div></div>)
        else return (<div className="form-error">{props.errorMessage}</div>)
    }

    const handelRegisterUser = (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('email', formData.email);
        fd.append('phone', formData.phone);
        fd.append('password', formData.password);
        fd.append('image', image, image.name);
        let count = 0
        if (Object.keys(check).length === 5) {
            Object.entries(check).map((item) => {
                if (item) {
                    count += 1
                }
                return count;
            })
        }
        if (count === 5) {
            axios.post('http://localhost:5000/staff/create', fd)
                .then((res) => {
                    if (res.data.success) {
                        toast.success('Đăng ký thành công')
                        setModal(false)
                        refreshTable()
                    }
                    toast.error(res.data.error)
                })
                .catch((e) => { console.log(e) })
        }
    }

    const onAvatarChange = (e) => {
        setImage(e.target.files[0])
    };

    return (
        <div className="register">
            <form className="form" onSubmit={(e) => handelRegisterUser(e)}>
                <div className="form__item">
                    <div className="form__item__title">Tạo tài khoản người dùng</div>
                </div>

                <div className="form__item">
                    <label htmlFor="name" className="form__item__label">Họ và tên</label>
                    <input
                        className="form__item__input"
                        type="text"
                        id="name"
                        placeholder="Username"
                        value={formData.name}
                        required
                        onChange={(e) => checkNull('name', e.target.value)} />
                    <FormError isHidden={errorMessage.errorName === ''} errorMessage={errorMessage.errorName} />
                </div>
                <div className="form__item">
                    <label htmlFor="email" className="form__item__label">Email</label>
                    <input
                        className="form__item__input"
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={formData.email}
                        required
                        onChange={(e) => checkEmail(e.target.value)} />
                    <FormError isHidden={errorMessage.errorEmail === ''} errorMessage={errorMessage.errorEmail} />
                </div>
                <div className="form__item">
                    <label htmlFor="password" className="form__item__label">Mật khẩu</label>
                    <input
                        className="form__item__input"
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={formData.password}
                        required
                        onChange={(e) => checkPassword(e.target.value)} />
                    <FormError isHidden={errorMessage.errorPassword === ''} errorMessage={errorMessage.errorPassword} />
                </div>

                <div className="form__item">
                    <label htmlFor="confirmPassword" className="form__item__label">Nhập lại mật khẩu</label>
                    <input
                        className="form__item__input"
                        type="password"
                        id="confirmPassword"
                        placeholder="Retype Password"
                        value={formData.confirmPassword}
                        required
                        onChange={(e) => checkRePassword(e.target.value)} />
                    <FormError isHidden={errorMessage.errorRePassword === ''} errorMessage={errorMessage.errorRePassword} />
                </div>
                <div className="form__item">
                    <label htmlFor="phone" className="form__item__label">Số điện thoại</label>
                    <input className="form__item__input"
                        type="number"
                        id="phone"
                        placeholder="Số điện thoại"
                        required
                        onChange={(e) => checkPhone(e.target.value)} />
                    <FormError isHidden={errorMessage.errorPhone === ''} errorMessage={errorMessage.errorPhone} />
                </div>
                <div className="form__item">
                    <label htmlFor="image" className="form__item__label">Avatar</label>
                    <input
                        className="form__item__input"
                        type="file"
                        id="image"
                        accept="image/png, image/jpeg"
                        required
                        onChange={e => onAvatarChange(e)}
                    />
                </div>

                <div className="form__item btn">
                    <button type="submit" className="form__item__submit">Tạo</button>
                </div>

            </form>
        </div>
    )
}

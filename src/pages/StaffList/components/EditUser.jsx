import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SelectedStatus from "./SelectedStatus";

export default function EditUser (props) {
  const { id, setModal, refreshTable } = props    
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (id) {
        axios.get(`api/staff/${id}`)
        .then(res => {
            if(res.data.success) {
                setFormData({ ...res.data.data })
            }
        }).catch((e) => console.log(e))
    }
  }, [id])
  const [errorMessage, setErrorMessage] = useState({
      errorName: "",
      errorEmail: "",
      errorPhone: "",
      errorAddress: ""
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  })
  const checkEmail = (value) => {
      // eslint-disable-next-line no-useless-escape
      const regexEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
      setFormData({ ...formData, email: value })
      if (regexEmail.test(value)) {
          setErrorMessage({ ...errorMessage, errorEmail: "" })
      } else {
          setErrorMessage({ ...errorMessage, errorEmail: "Email không hợp lệ!" })
      }
  }
  const checkPhone = (value) => {
      // eslint-disable-next-line no-useless-escape
      const regexPhone = new RegExp(/^[0-9\-\+]{9,12}$/)
      setFormData({ ...formData, phone: value })
      if (regexPhone.test(value)) {
          setErrorMessage({ ...errorMessage, errorPhone: "" })
      } else {
          setErrorMessage({ ...errorMessage, errorPhone: "Số điện thoại không hợp lệ" })
      }
  }
  const checkNull = (id, value) => {
      setFormData({ ...formData, [id]: value })
  }
  function FormError(props) {
      if (props.isHidden) return (<div></div>)
      else return (<div className="form-error">{props.errorMessage}</div>)
  }

  const handelUpdateUser = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('email', formData.email);
    fd.append('phone', formData.phone);
    fd.append('address', formData.address);
    if (image) {
      fd.append('image', image, image.name);
    }
    let count = 0
    if (Object.keys(errorMessage).length === 4) {
        Object.entries(errorMessage).map((item) => {
            if (item) {
                count += 1
            }
            return count;
        })
    }
    if (count === 4) {
      axios.post('/staff/update', fd)
      .then((res) => {
          if (res.data.success) {
              toast.success(res.data.data)
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
          <form className="form" onSubmit={(e)=>handelUpdateUser(e)}>
              <div className="form__item">
                  <div className="form__item__title">Chỉnh sửa thông tin nhân viên</div>
              </div>
              <div className="flex items-center border-b mb-2">
                <span>Thay đổi trạng thái đơn hàng: </span>
                <span className="w-64 mx-4">
                  <SelectedStatus id={id} refreshData={() => refreshTable()}/>
                </span>
              </div>
              <div className="form__item">
                  <label htmlFor="name" className="form__item__label">Họ và tên</label>
                  <input
                      className="form__item__input"
                      type="text"
                      id="name"
                      placeholder="Username"
                      defaultValue={formData?.name}
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
                      defaultValue={formData?.email}
                      required
                      onChange={(e) => checkEmail(e.target.value)} />
                  <FormError isHidden={errorMessage.errorEmail === ''} errorMessage={errorMessage.errorEmail} />
              </div>
              <div className="form__item">
                  <label htmlFor="phone" className="form__item__label">Số điện thoại</label>
                  <input className="form__item__input"
                      type="number"
                      id="phone"
                      placeholder="Số điện thoại"
                      defaultValue={formData?.phone}
                      required
                      onChange={(e) => checkPhone(e.target.value)} />
                  <FormError isHidden={errorMessage.errorPhone === ''} errorMessage={errorMessage.errorPhone} />
              </div>
              <div className="form__item">
                  <label htmlFor="phone" className="form__item__label">Địa chỉ</label>
                  <input className="form__item__input"
                      type="text"
                      id="address"
                      placeholder="Địa chỉ"
                      defaultValue={formData?.address}
                      required
                      onChange={(e) => checkNull('address',e.target.value)} />
                  <FormError isHidden={errorMessage.errorAddress === ''} errorMessage={errorMessage.errorAddress} />
              </div>
              <div className="form__item">
                  <label htmlFor="image" className="form__item__label">Avatar</label>
                  <input
                      className="form__item__input"
                      type="file"
                      id="image"
                      accept="image/png, image/jpeg"
                      onChange={e => onAvatarChange(e)}
                  />
              </div>
              <div className="form__item btn">
                  <button type="submit" className="form__item__submit">Chỉnh sửa</button>
              </div>
          </form>
      </div>
  )
}

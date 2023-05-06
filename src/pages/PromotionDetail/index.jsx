import axios from 'axios'
import FormError from 'components/custom-field/FormError'
import InputField from 'components/custom-field/InputField'
import Modal from 'components/Modal'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { VscTriangleRight } from 'react-icons/vsc'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import UpdateProductPromotion from './components/UpdateProductPromotion'
import SelectedStatus from './components/UpdateProductPromotion/SelectedStatus'

export default function PromotionDetail () {
  const { code } = useParams() 
  const [promotion, setPromotion] = useState([])
  const [modal, setModal] = useState(false)
  const [items, setItems] = useState([])
  const [itemValue, setItemValue] = useState('')
  const [products, setProducts] = useState([])

  const [errorForm, setErrorForm] = useState({
    items: '',
    content: '',
    dateStart: '',
    dateEnd: '',
    rate: '',
  })
  
  const [form, setForm] = useState({
    items: [],
    content: '',
    dateStart: '',
    dateEnd: '',
    rate: '',
  })

  const fetchData = (code) => {
    axios.post('/promotion/detail', {code})
    .then(res=> {
      if (res.data.success) {
        const data = res.data.data.promotion;
        const products = res.data.data.products;
        setPromotion(data)
        setProducts(products)
        setItems(data.items)
      } else {
        toast.error('Không thể kết nối máy chủ')
      }
    }).catch(e => {
      console.log(e.message)
    })
  }

  const handleAddItem = () => {
    if(itemValue) {
      setItemValue('')
      setErrorForm({ ...errorForm, items: '' })
      setItems(prev => [...prev, itemValue])
    } else {
      toast.warn('Không được rỗng')
    }
  }

  const handleRemoveItem = (index) => {
    if (items.length === 0) {
      setErrorForm({ ...errorForm, items: "Không được để trống." })
    }
    const item = items.splice(index, 1);
    const newItems = items.filter(prev => prev !== item)
    setItems(newItems)
  }

  const checkNull = (id, value) => {
    if(!value) setErrorForm({ ...errorForm, [id]: "Không được để trống." })
    else {
      setErrorForm({ ...errorForm, [id]: '' })
      setForm({ ...form, [id]: value })
    }
  }

  const handleUpdatePromotion = (e) => {
    e.preventDefault()
    let count = 0;
    const formData = {
      code: promotion.code,
      items,
      content: form.content || promotion.content,
      dateStart: form.dateStart || promotion.dateStart,
      dateEnd: form.dateEnd || promotion.dateEnd,
      rate: form.rate || promotion.rate,
    }
    Object.entries(formData).map(([key, val]) => {
      if ((val || val.length) && !errorForm[key]) {
        setErrorForm(prev => ({ ...prev, [key]: ''}))
        count += 1
      } else {
        setErrorForm(prev => ({ ...prev, [key]: 'không được để trống'}))
      }
      return count
    })
    if (count === 6) {
      axios.post('/promotion/update', formData)
      .then(res=> {
        if (res.data.success) {
          toast.success('Cập nhật thành công khuyến mãi')
          fetchData(code)
        } else {
          toast.error('Không thể kết nối máy chủ')
        }
      }).catch(e => {
        console.log(e.message)
      })
    } else {
      toast.error('Chưa nhập đủ trường hoặc sự cố')
    }
  }

  useEffect(()=> {
    fetchData(code);
  }, [code])

  return (
    <div className="">
      <Modal show={modal} setShow={setModal} size="sm:max-w-2xl" title="Cập nhật sản phẩm">
        <UpdateProductPromotion setModal={setModal} fetchData={()=>fetchData(code)} code={code}/>
      </Modal>
      <div className="productlist__header">
        <span className="productlist__header-title">Thông tin chi tiết khuyến mãi</span>
        <button className="" onClick={() => setModal(true)}>
          Trạng thái:
            {promotion.status === -1 ? <div className="btn btn-cancel">Hủy</div> :
            promotion.status === 1 ? <div className="btn btn-received">Đang áp dụng</div> :
            promotion.status === 3 ? <div className="btn btn-cancel">Hết hạn</div> :
            <span className="btn btn-pending">Chờ xử lý</span>}
        </button>
        <div className="flex items-center border-b mb-2">
          <span>Thay đổi trạng thái đơn hàng: </span>
          <span className="w-64 mx-4">
            <SelectedStatus id={code} refreshData={()=>fetchData(code)}/>
          </span>
        </div>
      </div>
      <div className="mt-2 p-4">
        <h3 className="font-bold">Mã khuyến mãi: <span className="text-xl">{code}</span></h3>
        <div className="grid grid-cols-6 px-2">
          <div className="col-span-6 sm:col-span-4 mr-4">
            <div className="grid grid-cols-6">
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  label="Tiêu đề"
                  type="text"
                  name="content"
                  defaultValue={promotion.content}
                  onChange={(e) => checkNull('content', e.target.value)}
                />
                <FormError isHidden={errorForm.content === ''} errorMessage={errorForm.content} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  label="Phần trăm (%)"
                  name="rate"
                  type="number"
                  defaultValue={promotion.rate}
                  onChange={(e) => checkNull('rate', e.target.value)}
                />
                <FormError isHidden={errorForm.rate === ''} errorMessage={errorForm.rate} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  label="Ngày bắt đầu"
                  name="date_start"
                  type="date"                    
                  defaultValue={moment(promotion.dateStart).format('YYYY-MM-DD')}
                  onChange={(e) => checkNull('dateStart', e.target.value)}
                  />
                <FormError isHidden={errorForm.dateStart === ''} errorMessage={errorForm.dateStart} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <InputField
                  label="Ngày kết thúc"
                  name="date_end"
                  type="date"
                  defaultValue={moment(promotion.dateEnd).format('YYYY-MM-DD')}
                  onChange={(e) => checkNull('dateEnd', e.target.value)}
                  />
                <FormError isHidden={errorForm.dateEnd === ''} errorMessage={errorForm.dateEnd} />
              </div>
              <div className="col-span-6 sm:col-span-6">
                <div className="flex items-center w-full">
                  <InputField
                    label="Nội dung các phần khuyến mãi"
                    name="items"
                    type="text"
                    defaultValue={itemValue ? itemValue : '' }
                    onChange={(e) => setItemValue(e.target.value)}
                  />
                  <span className="btn btn-info w-16" onClick={handleAddItem}>Thêm</span>
                </div>
                <div className="p-2 border border-sky-400 min-h-[50px] max-h-40 overflow-auto rounded-lg mb-2">
                {
                  promotion?.items?.length ? promotion.items.map((item, index) => (
                    <div className="flex items-center justify-between hover:bg-gray-50 p-2" key={index}>
                      <p><VscTriangleRight /> {item}</p>
                      <RiDeleteBin6Line
                        className="cursor-pointer text-rose-600 text-xl hover:text-rose-300"
                        onClick={() => handleRemoveItem(index)}
                      />
                    </div>
                  )) : ""
                }
                </div>
                <FormError isHidden={errorForm.items === ''} errorMessage={errorForm.items} />
              </div>
            </div>
          </div>
          <div className="col-span-6 sm:col-span-2 border border-gray-400 p-2 rounded-md">
            <h2 className="flex justify-between items-center font-bold text-xl border-sky-500 border-b">
              <span>Danh sách sản phẩm</span>
              <span className="btn btn-info" onClick={() => setModal(true)}>Cập nhật sản phẩm</span>
            </h2>
            <div className="h-[300px] h-full overflow-auto">
              { products && products.length > 0 && products.map((product, index) => (
                <div key={index} className="flex items-center p-2 overflow-hidden">
                  <span className="w-16 h-10">
                    <img className="corver" src={product.img} alt="" />
                  </span>
                  <span>{product.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={(e)=> handleUpdatePromotion(e)}
        >
            Cập nhật
        </button>
      </div>
    </div>
    </div>
  )
}

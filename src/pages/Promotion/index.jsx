import { DataGrid } from '@material-ui/data-grid'
import axios from 'axios'
import FormError from 'components/custom-field/FormError'
import InputField from 'components/custom-field/InputField'
import LoadingBox from 'components/LoadingBox'
import Modal from 'components/Modal'
import { useEffect, useState } from 'react'
import { RiCheckboxCircleLine, RiDeleteBin6Line } from 'react-icons/ri'
import { VscTriangleRight } from 'react-icons/vsc'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Promotion () {
  const [promotion, setPromotion] = useState([])
  const [modal, setModal] = useState(false)
  const [items, setItems] = useState([])
  const [itemValue, setItemValue] = useState('')
  const [delModal, setDelModal] = useState(false)
  const [curCode, setCurCode] = useState();

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
  const fetchData = () => {
    axios.get('/promotion')
    .then(res=> {
      if (res.data.success) {
        const data = res.data.data;
        setPromotion(data)
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

  const handleAddPromotion = (e) => {
    e.preventDefault()
    let count = 0;
    const formData = {
      items: items,
      content: form.content,
      dateStart: form.dateStart,
      dateEnd: form.dateEnd,
      rate: form.rate
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
    if (count === 5) {
      axios.post('/promotion/create', formData)
      .then(res=> {
        if (res.data.success) {
          toast.success('Tạo thành công khuyến mãi')
          fetchData()
          setModal(false);
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

  const handleSetModalDelOrder = (code) => {
      setDelModal(true);
      setCurCode(code)
  }

  const handleDelOrder = () => {
    axios.delete(`/promotion/${curCode}`)
    .then(res=> {
      if (res.data.success) {
        fetchData();
        setDelModal(false);
      } else {
        setDelModal(false);
        toast.error('Không thể kết nối máy chủ')
      }
    }).catch(e => {
      setDelModal(false);
      toast.error('Không thể kết nối máy chủ')
      console.log(e.message)
    })
  }

  useEffect(()=> {
    fetchData();
  }, [])

  const handleChangeStatus = (code, status) => {
    axios.post(`/promotion/status`, { code, status })
    .then(res => {
        if (res.data.success) {
          fetchData()
          toast.success('Áp dụng thành công.')
      }
    }).catch((e)=>{
      toast.error('Không thể kết nối máy chủ')
    })
}

  const columns = [
    {
        field: 'code', headerName: 'Mã Khuyến Mãi', width: 230, headerClassName: 'text', renderCell: (params) => {
            return (
                <span className="text">{params.row.code}</span>
            )
        }
    },
    {
        field: 'content', headerName: 'Tiêu đề', width: 220, headerClassName: 'text', renderCell: (params) => {
            return (
                <div className="columnImg">
                    <img className="columnImg__img" src={params.row.img} alt="" />
                    <span>
                        {params.row.content}
                    </span>
                </div>
            )
        }
    },
    {
        field: 'dateStart', headerName: 'Ngày bắt đầu', width: 200, headerClassName: 'text', renderCell: (params) => {
            return (
                <span className="text">{params.row.dateStart}</span>
            )
        }
    },
    {
        field: 'dateEnd', headerName: 'Ngày kết thúc', width: 200, headerClassName: 'text', renderCell: (params) => {
            return (
                <span className="text">{params.row.dateEnd}</span>
            )
        }
    },
    {
      field: 'rate', headerName: 'Tỉ lệ', width: 200, headerClassName: 'text', renderCell: (params) => {
          return (
              <span className="text">{params.row.rate}</span>
          )
      }
  },
    {
      field: 'status', headerName: 'Trạng thái', width: 200, headerClassName: 'text', renderCell: (params) => {
          return (
            <div className="text">
              {params.row.status === 0 &&
                <div className="flex items-center">
                    <span className="btn btn-pending">Chờ xử lý</span>
                    <span 
                      className="btn item-received"
                      onClick={() => handleChangeStatus(params.row.code, 1)}
                    >
                        <RiCheckboxCircleLine />
                    </span>
                </div>}
              {params.row.status === 1 && <div className="btn btn-received">Đang áp dụng</div>}
              {params.row.status === 3 && <div className="btn btn-cancel">Hết hạn</div>}
              {params.row.status === -1 && <div className="btn btn-cancel">Hủy</div>}
            </div>
          )
      }
    },{
      field: 'admin', headerName: 'Actions', width: 150, headerClassName: 'text', renderCell: (params) => {
          return (
              <>
                <Link to={`/promotion/${params.row.code}`} className="btn btn-info">
                  Chi tiết
                </Link>
                <div
                  className="btn btn-cancel"
                  onClick={() => {
                      handleSetModalDelOrder(params.row.code)
                  }}
                >
                  <RiDeleteBin6Line />
                </div>
              </>
          )
      }
    },
  ]

  return (
    <div className="">
      <Modal show={modal} setShow={setModal} size="sm:max-w-2xl" title="Tạo mới khuyến mãi">
          <div className="mt-2">
            <form onSubmit={handleAddPromotion}>
              <div className="grid grid-cols-6">
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    label="Tiêu đề"
                    type="text"
                    name="content"
                    onChange={(e) => checkNull('content', e.target.value)}
                  />
                  <FormError isHidden={errorForm.content === ''} errorMessage={errorForm.content} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    label="Phần trăm (%)"
                    name="rate"
                    type="number"
                    min={1}
                    max={100}
                    onChange={(e) => checkNull('rate', e.target.value)}
                  />
                  <FormError isHidden={errorForm.rate === ''} errorMessage={errorForm.rate} />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    label="Ngày bắt đầu"
                    name="date_start"
                    type="date"                    
                    onChange={(e) => checkNull('dateStart', e.target.value)}
                    />
                  <FormError isHidden={errorForm.dateStart === ''} errorMessage={errorForm.dateStart} />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <InputField
                    label="Ngày kết thúc"
                    name="date_end"
                    type="date"
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
                    items.length ? items.map((item, index) => (
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
                <div className="col-span-6 sm:col-span-3 mt-4">
                </div>
              </div>
              <button
                type="submit"
                className="mt-3 float-right rounded-md border border-gray-300 bg-sky-500 px-4 py-2 text-base font-medium text-white shadow-sm sm:mt-0 sm:w-auto sm:text-sm"
              >
                  Tạo mới
              </button>
            </form>
          </div>
      </Modal>
      <Modal show={delModal} setShow={setDelModal} size="sm:max-w-lg" title="Xác nhận xóa khuyến mãi">
          <div className="mt-2">
              <p className="text-xl text-gray-800">
                Bạn có chắc chắn muốn xóa khuyến mãi {curCode} ?
              </p>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={ ()=> handleDelOrder() }
              >
                  Xác nhận
              </button>
              <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={()=> setDelModal(false)}
              >
                  Bỏ qua
              </button>
          </div>
      </Modal>
      <div className="productlist__header">
          <span className="productlist__header-title">Danh sách Khuyến Mãi</span>
          <button className="btn btn-info" onClick={() => setModal(true)}>Tạo khuyến mãi</button>
      </div>
      {promotion ?
          <DataGrid
              disableSelectionOnClick
              rows={promotion && promotion.map((item, index) => ({
                  id: item._id,
                  code: item.code,
                  content: item.content,
                  dateStart: item.dateStart,
                  dateEnd: item.dateEnd,
                  status: item.status,
                  rate: item.rate
              }))}
              columns={columns}
              pageSize={10}
              autoHeight
              // rowsPerPageOptions={[5]}
              rowsPerPageOptions={[10]}
          />: <LoadingBox />
      }
    </div>
  )
}

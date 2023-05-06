import axios from "axios"
import RadioField from "components/custom-field/RadioField"
import { useEffect, useState } from "react"
import { TiTick } from "react-icons/ti"
import { toast } from "react-toastify"

export default function UpdateProductPromotion (props) {
  const { code, fetchData, setModal } = props
  const [products, setProducts] = useState([])
  const [ids, setIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [checkedBox, setCheckedBox] = useState(false)
  const [type, setType] = useState('product')

  useEffect(() => {
    setLoading(true)
    axios.post('/promotion/product/list', { type })
    .then(res => {
      if(res.data.success) {
        const data = res.data.data
        const filter = data.filter(prev => prev.promotion_code === code).map((item => item.id))
        setIds(filter)
        setLoading(false)
        setProducts(data)
      }
    }).catch((e) => {
      setLoading(false)
      toast.error('Không thể kết nối máy chủ')
    })
  }, [type, code])

  function checkActive(value) {
    const index = ids.findIndex(prev => prev === value);
    if (index < 0) {
        return false;
    } else return true
  }
  const addFilterOption = (value) => {
    const index = ids.findIndex(prev => prev === value)
    if (index < 0) {
        setIds((prev) => [...prev, value])
    } else {
        removeFilterOption(value)
    }
  }

  const removeFilterOption = (value) => {
    const index = ids.findIndex(prev => prev === value);
    if (index < 0) return;
    else {
        const item = ids.splice(index, 1)
        const newList = ids.filter(prev => prev !== item)
        setIds(newList);
    }
  }
  const handleCheckBoxAll = (checked) => {
    if (checked) {
      const newIds = products.map((item => item.id))
      setIds(newIds)
    } else {
      setIds([])
    }
  }
  
  const handleUpdateProduct = (id) => {
    axios.post('/promotion/update/product-code', { code, ids, type, del: false })
    .then(res=> {
      if(res.data.success) {
        toast.success(res.data.data)
        setModal(false)
        fetchData()
      }
    }).catch(e=> console.log(e))
  }

  const handleRemoveProduct = (id) => {
    axios.post('/promotion/update/product-code', { code, ids, type, del: true })
    .then(res=> {
      if(res.data.success) {
        toast.success(res.data.data)
        setModal(false)
        fetchData()
      }
    }).catch(e=> console.log(e))
  }

  useEffect(() => {
    if (ids.length === products.length) {
      setCheckedBox(true)
    } else {
      setCheckedBox(false)
    }
  },[ids, products])

  return (
  <div className="mt-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <RadioField title="Mô Tô" id="pro" name="type" defaultChecked={type === 'product' ? true : false} onChange={() => setType('product')}/>
        <RadioField title="Phụ tùng" id="acc" name="type" defaultChecked={type === 'accessory' ? true : false} onChange={() => setType('accessory')}/>
      </div>
      <div className="flex items-center">
        <input
          id='all'
          name='all'
          type="checkbox"
          checked={checkedBox}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 m-0 mr-2"
          onChange={e => handleCheckBoxAll(e.target.checked)}
        />
        <label htmlFor="all">Tất cả</label>
      </div>
    </div>

    <div className="h-[300px] overflow-auto border border-sky-500 rounded-md p-2 mb-4">
      { loading ? 
      <div className="rounded-md py-4 max-w-sm w-full">
          <div className="animate-pulse space-x-2 flex justify-start">
            <div className="rounded-full bg-red-500 h-6 w-6"></div>
            <div className="rounded-full bg-green-500 h-6 w-6"></div>
            <div className="rounded-full bg-yellow-500 h-6 w-6"></div>
          </div>
        </div> :
        <div className="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200">
          {products && products.map((item, index) => (
            <div key={index} className={`relative flex items-start hover:bg-gray-100 py-2 ${checkActive(item.id) ? 'hover:bg-sky-100 text-white' : ''}`} onClick={() => addFilterOption(item.id)}>
              <div className="min-w-0 flex-1 text-sm">
                <label htmlFor={`item-${item.id}`} className="select-none font-medium text-gray-700 flex items-center">
                  <p className="w-10 h-8 mr-2">
                    <img src={item.img} alt="Hình ảnh"/>
                  </p>
                  {item.name}
                </label>
              </div>
            { checkActive(item.id) ?<TiTick className="text-2xl p-2 rounded-full bg-sky-500 text-white w-fit h-fit"/> :'' }
            </div>
          ))}
        </div>
      }
    </div>
    <button
      type="submit"
      className="mt-3 float-right rounded-md border border-gray-300 bg-sky-500 px-4 py-2 text-base font-medium text-white shadow-sm sm:mt-0 sm:w-auto sm:text-sm"
      onClick={handleUpdateProduct}
    >
      Cập nhật
    </button>
    <button
      type="submit"
      className="mt-3 float-right rounded-md border border-gray-300 bg-rose-500 px-4 py-2 text-base font-medium text-white shadow-sm sm:mt-0 sm:w-auto sm:text-sm"
      onClick={handleRemoveProduct}
    >
      Xóa
    </button>
  </div>
)}

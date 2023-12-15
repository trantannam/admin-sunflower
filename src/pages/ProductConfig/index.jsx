import initFormData from 'assets/data/configInitForm.json'
import InputField from 'components/custom-field/InputField'
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import request from 'utils/request'
import './Product.scss'

export default function ProductConfig () {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  useEffect(() => {
      scrollToTop();
  }, []);
  const { id } = useParams()
  const [formData, setFormData] = useState(initFormData)
  useEffect(()=> {
      request.get(`/products/config/${id}`)
      .then(res => {
          if (res.data.success) {
              if (res.data.data.dong_co) {
                setFormData(res.data.data)
              }
          } else {
              toast.error('Không thể kết nối máy chủ')
          }
      }).catch((e)=> {
          toast.error('Không thể kết nối máy chủ')
      })
  }, [id])

  const updateState = (index, key, val) => {
    const newArray = formData[key].map((item, i) => {
      if (index === i) {
        return { ...item, value: val};
      } else {
        return item;
      }
    });
    setFormData(prev => ({...prev, [key]: newArray}));
  };

  const updateProductConfig = (e) => {
    e.preventDefault();
    request.put(`/products/config/update/${id}`, formData)
        .then(res => {
            if (res.data.success) {
              toast.success('Cập nhật thành công')
            } else {
                toast.error('Không thể kết nối máy chủ')
            }
        }).catch((e)=> {
            toast.error('Không thể kết nối máy chủ')
        })
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold">Thông số kỹ thuật</h1>
      <form className="p-8" onSubmit={updateProductConfig}>
        <div className="my-10 sm:mt-0">
          <div className="md:grid md:grid-cols-4 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="content__title">
                  Động cơ
                </h3>
                <p className="mt-1 text-sm text-gray-600"></p>
              </div>
            </div>

            <div className="mt-5 md:col-span-3 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                  {formData && formData.dong_co.map((item, index)=> (
                    <div key={item.name + index} className="col-span-6 sm:col-span-2">
                      <InputField
                        label={item.name}
                        name='name'
                        type="text"
                        required
                        defaultValue={item?.value}
                        onChange={(e) => updateState(index, 'dong_co', e.target.value )}
                      />
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-10 sm:mt-0">
          <div className="md:grid md:grid-cols-4 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="content__title">
                  Kết cấu
                </h3>
                <p className="mt-1 text-sm text-gray-600"></p>
              </div>
            </div>

            <div className="mt-5 md:col-span-3 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                  {formData && formData.ket_cau.map((item, index)=> (
                    <div key={item.name + index} className="col-span-6 sm:col-span-2">
                      <InputField
                        label={item.name}
                        name="first-name"
                        type="text"
                        required
                        defaultValue={item?.value}
                        onChange={(e) => updateState(index, 'ket_cau', e.target.value )}
                      />
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-10 sm:mt-0">
          <div className="md:grid md:grid-cols-4 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="content__title">
                  Kích thước
                </h3>
                <p className="mt-1 text-sm text-gray-600"></p>
              </div>
            </div>

            <div className="mt-5 md:col-span-3 md:mt-0">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                  {formData && formData.kich_thuoc.map((item, index)=> (
                    <div key={item.name + index} className="col-span-6 sm:col-span-2">
                      <InputField
                        label={item.name}
                        name="first-name"
                        type="text"
                        required
                        defaultValue={item?.value}
                        onChange={(e) => updateState(index, 'kich_thuoc', e.target.value )}
                      />
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button className="text-xl rounded-full p-4 text-white bg-sky-400 float-right mb-10">Cập nhật</button>
        </div>
      </form>
    </div>
  )
}

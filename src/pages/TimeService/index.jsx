import axios from 'axios';
import InputField from 'components/custom-field/InputField';
import SelectField from 'components/custom-field/SelectField';
import Loading from 'components/Loading';
import Modal from 'components/Modal';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { TiTick } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './time-service.scss';

export default function TimeService (props) {
    const [modalTime, setModalTime] = useState(false)
    const [modal, setModal] = useState(false)
    const [timeService, setTimeService] = useState([])
    const [timeServiceDetail, setTimeServiceDetail] = useState([])
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState()
    const toDay = new Date();
    
    const [errorMessage, setErrorMessage] = useState({
      startDate: "",
      endDate: "",
      time: "",
    })

    const [formData, setFormData] = useState({
      startDate: "",
      endDate: "",
      time: "",
    })

    const timeOptions = [
      {
        label: 'Chọn thời gian',
        value: 0,
      },
      {
        label: '15 phút',
        value: 15,
      },
      {
        label: '20 phút',
        value: 20,
      },
      {
        label: '30 phút',
        value: 30,
      },
      {
        label: '45 phút',
        value: 45,
      },
      {
        label: '60 phút',
        value: 60,
    }]
    const [timeSelected, setTimeSelect] = useState(timeOptions[0])
    const handleSelectTime = (val) => {
      if (val.value !== 0){
        setTimeSelect(val);
        setErrorMessage(prev => ({...prev, time: ''}))
        setFormData(prev=> ({...prev, time: val.value}));
      }
    }

    const handleSelectTimeServiceDetail = (item) => {
      setModalTime(true)
      setTimeServiceDetail(item)
    }

    const handleChangeDate = (date) => {
      setLoading(true);
      setDate(date);
      setTimeout(()=> {
        setLoading(false)
        clearTimeout();
      }, 500)
    }

    function checkDate (key, val) {
      const date = val.split(':');
      const hours = date[0];
      const minutes = date[1];
      if (hours > 6 && hours < 20) {
        if (minutes % 15 === 0 ||
          minutes % 20 === 0 ||
          minutes % 30 === 0 ||
          minutes % 45 === 0 ||
          minutes === 0
          ) {
          setErrorMessage(prev => ({...prev, [key]: ''}))
          setFormData(prev=> ({...prev, [key]: val}))
        } else {
          setErrorMessage(prev => ({...prev, [key]: 'Thời gian không hợp lệ.'}))
        }
      } else {
        setErrorMessage(prev => ({...prev, [key]: 'Thời gian không hợp lệ.'}))
      }
    }

    function FormError(props) {
        if (props.isHidden) return (<div></div>)
        else return (<div className="form-error">{props.errorMessage}</div>)
    }
    let count= 0;
    const handleCreateNewMain = () => {
      Object.entries(formData).map(([key, val]) => {
        if (val && !errorMessage[key]) {
          setErrorMessage(prev => ({ ...prev, [key]: ''}))
          count += 1
        } else {
          setErrorMessage(prev => ({ ...prev, [key]: 'không được để trống'}))
        }
        return count
      });
      if(count === 3) {
        axios.post('/time-service/create', {
          start: '01/01/2022 ' + formData.startDate,
          end: '01/01/2022 ' + formData.endDate,
          period: formData.time
        })
        .then(res=> {
          if(res.data.success) {
            setModal(false)
            fetchData()
            toast.success('Tạo thành công')
          }
        }).catch((e) => {
          toast.error('Không thể kết nối máy chủ')
        })
      }
    }

    function fetchData() {
      axios.get('/time-service/')
      .then(res=> {
        if(res.data.success) {
          setTimeService(res.data.data)
        }
      }).catch((e) => {
        toast.error('Không thể kết nối máy chủ')
      })  
    }
    useEffect(()=> {
      fetchData()
    }, [])

    function handleCheckOverService (item) {
      if (item.staff.length === 0) {
        return 0
      }
      if (item.staff.length > 0) {
        const countStaff = item.staff.filter(prev => (moment(prev.time).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')))
        if (countStaff.length === timeService.totalStaff) {
          return 3
        } else if (countStaff.length >= 1) {
          return 2
        } else {
          return 0
        }
      }
    }

    // const handleCheckTimeService = (staff, user) => {
    //   axios.put('/time-service/remove-staff', {
    //     id: timeServiceDetail._id, staff, user, maintenance: timeServiceDetail.timeServiceDetail})
    //   .then(res=> {
    //     if(res.data.success) {
    //       fetchData()
    //       setModalTime(false)
    //     }
    //   }).catch((e) => {
    //     toast.error('Không thể kết nối máy chủ')
    //   })  
    // }

    return (
        <div className="px-10">
            <Modal show={modal} setShow={setModal} size="sm:max-w-lg" title="Tạo mới lịch bảo dưỡng">
                <div className="text-gray-500 p-2 bg-gray-300 rounded-md">
                  <span>Thời gian cho phép từ 6h - 20h và thời gian cho mõi lần là 15, 20, 30, 45 và 60 phút.</span>
                </div>
                <div className="mt-2 flex">
                    <div className="">
                        <InputField
                            label="Thời gian bắt đầu"
                            name="timeStart"
                            type="time"
                            onChange={(e) => checkDate('startDate', e.target.value)}
                        />
                        <FormError isHidden={errorMessage.startDate === ''} errorMessage={errorMessage.startDate} />
                    </div>
                    <div className="">
                        <InputField
                            label="Thời gian kết thúc"
                            name="timeEnd"
                            type="time"
                            onChange={(e) => checkDate('endDate', e.target.value)}
                        />
                      <FormError isHidden={errorMessage.endDate === ''} errorMessage={errorMessage.endDate} />
                    </div>
                </div>
                <div className="">
                  <SelectField
                    label="Thời gian cho 1 lần bảo dưỡng"
                    options={timeOptions}
                    selected={timeSelected}
                    onChange={handleSelectTime}
                  />
                  <FormError isHidden={errorMessage.time === ''} errorMessage={errorMessage.time} />
                </div>
                <span className="text-sm text-rose-500 pt-5">Lưu ý: Tạo mới sẽ xóa toàn bộ lịch trình hiện có và thay thế bằng cái mới!!!</span>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={()=> handleCreateNewMain()}
                    >
                        Xác nhận
                    </button>
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={()=> setModal(false)}
                    >
                        Bỏ qua
                    </button>
                </div>
            </Modal>

            <Modal show={modalTime} setShow={setModalTime} size="sm:max-w-2xl" title="Thông tin">
              <p className="font-bold">Thời gian: <span className="text-xl">{timeServiceDetail?.time}</span></p>
              <div className="h-[250px] overflow-auto">
                {timeServiceDetail?.staff?.length ? 
                timeServiceDetail.staff.filter(prev => (moment(prev.time )
                .format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD'))).map((item, index) => (
                  <div className="flex mt-4 border border-gray-600 rounded-md justify-between items-center" key={index}>
                    <div className="flex">
                      <p className="w-fit p-4">
                      {item.staff_name}
                      </p>
                      <p className="w-fit p-4">
                      {item.user_name}
                      </p>
                      {item._id}
                    </div>
                    <div>
                      <TiTick className="w-8 h-8 text-green-400 mr-2 btn" 
                        // onClick={() => handleCheckTimeService(item.staff, item.user)}
                      />
                    </div>
                  </div>
                )) : <p className="p-6 font-bold text-xl text-center">Lịch Trống</p>}
              </div>
            </Modal>
            <div className="flex justify-between">
                <div className="text-2xl leading-6 text-gray-900 font-bold">Lịch trình bảo dưỡng</div>
                <div>
                  <Link to='/create-maintenance' className="btn btn-info">Đặt lịch</Link>
                  <div className="btn btn-info" onClick={()=>setModal(true)}>Tạo lại lịch</div>
                </div>
            </div>
            <div className="w-[300px]">
                <InputField
                    label="Ngày"
                    name="date"
                    type="date"
                    defaultValue={moment(toDay).format('YYYY-MM-DD')}
                    onChange={(e) => handleChangeDate(e.target.value)}
                />
            </div>
            <div className="p-4">
                { loading ? <Loading /> : 
                  <div className="flex flex-wrap">
                    { timeService.timeService && timeService.timeService.map((item, index) => (
                      <div key={index}
                        className={`btn-time
                        ${
                          handleCheckOverService(item) === 3 ? 'bg-rose-300 text-white' :
                          handleCheckOverService(item) === 2 ? 'bg-orange-400 text-white' : ''
                        }`}
                        onClick={()=> handleSelectTimeServiceDetail(item)}
                        >
                        {item.time}
                      </div>
                    ))}
                  </div>
                }
            </div>
        </div>
    )
}

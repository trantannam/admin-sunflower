import FeaturedInfo from 'components/FeaturedInfo/FeaturedInfo'
import { useState, useEffect } from 'react'
import axios from 'axios';

import CardPageVisits from "components/Cards/CardPageVisits.jsx";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.jsx";
import Chart from 'components/Chart/Chart';
import BasicDateRangePicker from 'components/BasicDateRangePicker';
import { addDays } from 'date-fns';
import SelectField from 'components/custom-field/SelectField';
import { toast } from 'react-toastify';

const Home = () => {
    document.title = "Admin - Dashboard"
    const [loadingChart, setLoadingChart] = useState(false)
    const [dataTable, setDataTable] = useState([])
    const [state, setState] = useState([
      {
        startDate:  addDays(new Date(), -180),
        endDate: new Date(),
        key: 'selection'
      }
    ]);

    const stepOption = [
      {
        label: 'Ngày',
        value: 'day',
      },
      {
        label: 'Tuần',
        value: 'week',
      },
      {
        label: 'Tháng',
        value: 'month',
      },
      {
        label: 'Năm',
        value: 'year',
      }
    ]
    const [step, setStep] = useState(stepOption[1])
    const [data, setData] = useState([])
    // useEffect(() => {
    //   try {
    //     setLoadingChart(true)
    //     axios.post('/dashboard/chart', {
    //       dateStar: state[0].startDate,
    //       dateEnd: state[0].endDate,
    //       step: step.value ?? 'week'
    //     }).then(res=> {
    //       if(res.data.success) {
    //         setData(res.data.data)
    //       }
    //     }).catch((e) => toast.error('Không thể kết nối máy chủ'))
  
    //     axios.get('/dashboard/table')
    //     .then(res=> {
    //       if(res.data.success) {
    //         setDataTable(res.data.data)
    //       }
    //     }).catch((e) => toast.error('Không thể kết nối máy chủ'))
    //     setTimeout(() => {
    //       setLoadingChart(false)
    //       clearTimeout()
    //     }, 500)
    //   } catch (e) {
    //     console.log(e.message)
    //   }
    // }, [])

    const handleFilterChartTime = () => {
      setLoadingChart(true)
      axios.post('/dashboard/chart', {
        dateStar: state[0].startDate,
        dateEnd: state[0].endDate,
        step: step.value ?? 'week'
      }).then(res=> {
        if(res.data.success) {
          setData(res.data.data)
        }
      }).catch((e) => toast.error('Không thể kết nối máy chủ'))
      setTimeout(() => {
        setLoadingChart(false)
        clearTimeout()
      }, 500)
    }

    return (
    <>
        <FeaturedInfo />
        <div className="flex w-full">
          <div className="ml-4 min-h-[600px]">
            <div>
              <SelectField
                label="Lọc theo" //lable name
                options={stepOption}
                selected={step}
                onChange={setStep}
              />
              <BasicDateRangePicker state={state} setState={setState} />
            </div>
            <button className="btn btn-info w-full text-center" onClick={handleFilterChartTime}>Xem</button>
          </div>
          <Chart data={data} width={600} title="Thống kê doanh thu" dataKey="total" label="name" loading={loadingChart} />
        </div>
        <div className="flex flex-wrap mt-4">
          <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
            <CardPageVisits data={dataTable?.orders} />
          </div>
          <div className="w-full xl:w-6/12 px-4">
            <CardSocialTraffic data={dataTable?.maintenance} />
          </div>
        </div>
      </>
    )
}

export default Home


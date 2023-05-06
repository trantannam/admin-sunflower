import moment from "moment";
import { Link } from "react-router-dom";

export default function CardSocialTraffic(props) {
  const { data } = props 

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                Dịch vụ bảo dưởng
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <Link to='/maintenance-service'
                className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                Xem tất cả
              </Link>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead className="thead-light">
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Khách hàng
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Nhân viên
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Thời gian
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              { data?.length ? data.map(item => (
                <tr key={item._id}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {item.name}
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {item.staff}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {moment(item.dateTime).format('DD/MM/YYYY hh:mm')}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <i className="fas fa-arrow-up text-emerald-500 mr-4"></i>
                    {item.status === -1 && <div className="btn btn-cancel">Đã hủy</div>}
                    {item.status === 0 && <div className="btn btn-pending">Chờ xử lý</div>}
                    {item.status === 2 && <div className="btn btn-transport">Đã tiếp nhận</div>}
                    {item.status === 3 && <div className="btn btn-transport">Đang vận chuyển</div>}
                  </td>
                </tr>
              )): <tr>
                    <td colSpan="4" className="border-t-10 px-6 align-middle border-l-0 border-r-0 text-xs text-center opacity-50 whitespace-nowrap p-8 text-left w-full">
                      Không có đơn hàng
                    </td>
                  </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

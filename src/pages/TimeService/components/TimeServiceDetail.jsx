
export function TimeServiceDetail (props) {
  const { data } = props;
  return (
    <>
      <p className="font-bold">Thời gian: <span className="text-xl">{data?.time}</span></p>
      <div className="h-[250px] overflow-auto">
        {data?.staff && data?.staff.map((item, index) => (
          <div className="flex">
            <p className="w-1/2 p-4">
            {item.staff_name}
            </p>
            <p className="w-1/2 p-4">
            {item.user_name}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}

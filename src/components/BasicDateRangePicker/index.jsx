import { DateRange } from 'react-date-range';

export default function BasicDateRangePicker (props) {
  
  const {state, setState} = props;

  return (
    <DateRange
      editableDateInputs={true}
      direction="vertical"
      months={1}
      maxDate={new Date()}
      onChange={item => setState([item.selection])}
      ranges={state}
    />
  )
}
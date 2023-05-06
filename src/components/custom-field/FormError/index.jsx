
export default function FormError(props) {
  if (props.isHidden) { return null; }
  return (<div className="form-error text-red-600">{props.errorMessage}</div>)
}

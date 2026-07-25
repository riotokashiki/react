export default function ResetButton(props) {
  function reset(props) {
    localStorage.clear();
    props.completed([]);
    props.uncompleted([]);
  }

  return (
    <button
      className="reset_button"
      onClick={() => {
        reset(props);
      }}
    >
      Reset
    </button>
  );
}


import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);
    function handleClick() {
    setValue('X');//{value}にXが代入される
  }
  return <button className="square"   onClick={handleClick}>{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square  />
        <Square  />
        <Square  />
      </div>
      <div className="board-row">
        <Square  />
        <Square  />
        <Square  />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square  />
      </div>
    </>
  );
}

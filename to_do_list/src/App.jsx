//React Hookをインポート↓↓
import { useState, useEffect } from "react";
//cssシートをインポート↓↓
import "./App.css";

import ResetButton from "./reset_button";

//大文字で始まってるのでリアクトコンポーネント↓↓
export default function App() {
  const [todos, setTodos] = useState(() => {
    const restored_uncompleted_list = JSON.parse(
      localStorage.getItem("saved_uncompleted_list"),
    );
    return restored_uncompleted_list ? restored_uncompleted_list : [];
  }); //an empty array
  const [input, setInput] = useState(""); //empty text area
  const [editingIndex, setEditingIndex] = useState(null);
  const [doneTodos, setDoneTodos] = useState(() => {
    const restored_completed_list = JSON.parse(
      localStorage.getItem("saved_completed_list"),
    );
    return restored_completed_list ? restored_completed_list : [];
  });
  const [priority, setPriority] = useState("middle");
  const onOptionChange = (e) => {
    setPriority(e.target.value);
  };
  const [isMoveItBackDone, setIsMoveItBackDone] = useState(false);

  //Appマウント時に1回のみ実行↓↓
  useEffect(() => {
    const restored_uncompleted_list = JSON.parse(
      localStorage.getItem("saved_uncompleted_list"),
    );
    const restored_completed_list = JSON.parse(
      localStorage.getItem("saved_completed_list"),
    );
    console.log("restored_uncompleted_list is...");
    console.log(restored_uncompleted_list);
    console.log("restored_completed_list is...");
    console.log(restored_completed_list);
    if (restored_uncompleted_list) {
      setTodos(restored_uncompleted_list);
    }
    if (restored_completed_list) {
      setDoneTodos(restored_completed_list);
    }
  }, []);

  //todosに変化が生じた時だけ以下を実行↓↓(初回マウント時も実行される)
  useEffect(() => {
    localStorage.setItem("saved_uncompleted_list", JSON.stringify(todos));
    console.log("(at App() )localStorage uncompleted_list is...");
    console.log(JSON.parse(localStorage.getItem("saved_uncompleted_list")));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("saved_completed_list", JSON.stringify(doneTodos));
    console.log("(at App() )localStorage completed_list is...");
    console.log(JSON.parse(localStorage.getItem("saved_completed_list")));
  }, [doneTodos]);

  useEffect(() => {
    console.log("current priority=" + priority);
  }, [priority]);

  //Regular Function↓↓
  function handleAdd() {
    if (!input) {
      alert("タスクを入力してください！");
      return;
    }
    //状態変数を更新↓↓
    if (priority === "middle") {
      setTodos((prev) => [
        { text: input, completed: false, priority: "middle", id: Date.now() },
        ...prev,
      ]); //Updating setTodos Array (prepending "input" to the todos array)
      setInput(""); //Initializing the "input" (since you pressed the Add button)
      console.log("(at handleAdd) todos=");
      console.log(todos);
    } else if (priority === "high") {
      setTodos((prev) => [
        { text: input, completed: false, priority: "high", id: Date.now() },
        ...prev,
      ]); //Updating setTodos Array (prepending "input" to the todos array)
      setInput(""); //Initializing the "input" (since you pressed the Add button)
      console.log("(at handleAdd) todos=");
      console.log(todos);
    } else {
      setTodos((prev) => [
        { text: input, completed: false, priority: "low", id: Date.now() },
        ...prev,
      ]); //Updating setTodos Array (prepending "input" to the todos array)
      setInput(""); //Initializing the "input" (since you pressed the Add button)
      console.log("(at handleAdd) todos=");
      console.log(todos);
    }
  }

  function removeTask(i, e) {
    console.log("The remove button clicked!");
    e.stopPropagation();
    setTodos(todos.filter((_, index) => removeCurrentIndex(index)));
    // .filterはcallbackにtrueを返すもののみを残す

    // the callback関数↓↓
    function removeCurrentIndex(index) {
      console.log(`index!==${i}=${index !== todos[i]}`);
      return index !== i;
      // index が i じゃないものをtrueとして残す(indexがiのアイテムを削除)
    }
  }

  function move_it_back(i, e, id) {
    console.log("The completed item clicked!");
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: false };
        }
        return todo;
      }),
    );
    setIsMoveItBackDone(true);
    removeTask_completed(i, e);
  }

  function removeTask_completed(i, e) {
    if (isMoveItBackDone) {
      console.log("The remove button clicked!");
    }
    e.stopPropagation();
    setDoneTodos(doneTodos.filter((_, index) => removeCurrentIndex(index)));
    // .filterはcallbackにtrueを返すもののみを残す

    // the callback関数↓↓
    function removeCurrentIndex(index) {
      console.log(`index!==${i}=${index !== todos[i]}`);
      return index !== i;
      // index が i じゃないものをtrueとして残す(indexがiのアイテムを削除)
    }
  }

  function add_completed(i) {
    setDoneTodos((prev) => [
      { text: todos[i].text, completed: true, id: todos[i].id },
      ...prev,
    ]); //Updating setTodos Array (prepending "input" to the todos array)
    console.log("(stale)doneTodos is...");
    console.log(doneTodos);
  }

  function completeTask(i) {
    if (todos[i].completed) {
      console.log("completeTask() executed! and strikethrough removed!");
      setTodos(
        todos.map((todo, index) => {
          if (index === i) {
            return { ...todo, completed: false };
          }
          return todo;
        }),
      );
    } else {
      console.log("completeTask() executed! and strikethrough applied!");
      setTodos(
        todos.map((todo, index) => {
          if (index === i) {
            return { ...todo, completed: true };
          }
          return todo;
        }),
      );
    }
  }

  function editTask(i) {
    setEditingIndex(i); //編集インデックスをiへ更新
  }

  const show_or_not = { display: doneTodos.length !== 0 ? "block" : "none" };

  return (
    <div className="container">
      <div className="input_container">
        <input
          value={input}
          className="inputField"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          onChange={(e) => {
            setInput(e.target.value);
          }} /*setting an eventListener*/
        />
        <button onClick={handleAdd} className="add_button">
          Add
        </button>

        <div className="pritorityContainer">
          <p className="priority-title">優先度：</p>
          <div className="buttonWrapper">
            <div className="choiceWrapper1">
              <input
                type="radio"
                id="priorityChoice1"
                name="priority"
                value="high"
                onChange={(e) => {
                  onOptionChange(e);
                }}
              />
              <label htmlFor="priorityChoice1">高</label>
            </div>
            <div className="choiceWrapper2">
              <input
                type="radio"
                id="priorityChoice2"
                name="priority"
                value="middle"
                onChange={(e) => {
                  onOptionChange(e);
                }}
                defaultChecked
              />
              <label htmlFor="priorityChoice2">中</label>
            </div>
            <div className="choiceWrapper3">
              <input
                type="radio"
                id="priorityChoice3"
                name="priority"
                value="low"
                onChange={(e) => {
                  onOptionChange(e);
                }}
              />
              <label htmlFor="priorityChoice3">低</label>
            </div>
          </div>
        </div>
      </div>
      <ul>
        {todos.map((todo, i) => {
          const striken = {
            display: todos[i].completed ? "none" : "flex",
          };
          const priority_style = {
            borderLeft:
              todo.priority === "low"
                ? "10px blue solid"
                : todo.priority === "middle"
                  ? " 10px yellow solid"
                  : "10px red solid",
          };

          return (
            // the i is how index numbers should be called
            <li
              key={i}
              style={{ ...striken, ...priority_style }}
              className="list"
              onClick={() => {
                completeTask(i);
                add_completed(i);
              }}
            >
              <input type="checkbox"></input>
              {editingIndex === i ? (
                <input value={todo.text}></input>
              ) : (
                todo.text
              )}
              <button className="del_button" onClick={(e) => removeTask(i, e)}>
                x
              </button>
            </li>
          );
        })}
      </ul>
      <div style={show_or_not}>
        <p className="sectionTitle">completed list </p>
        <ul>
          {doneTodos.map((todo, i) => {
            const hide = {
              textDecoration: "line-through",
            };
            return (
              <li
                key={i}
                style={hide}
                className="list"
                onClick={(e) => move_it_back(i, e, todo.id)}
                id={todo.id}
              >
                <input type="checkbox" checked={true} readOnly></input>
                {doneTodos[i].text}
                <button
                  className="del_button"
                  onClick={(e) => removeTask_completed(i, e)}
                >
                  x
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <ResetButton completed={setDoneTodos} uncompleted={setTodos} />
    </div>
  );
}

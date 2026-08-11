//React Hookをインポート↓↓
import { useState, useEffect, createElement } from "react";
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
  const [priority, setPriority] = useState("2");
  const onOptionChange = (e) => {
    setPriority(e.target.value);
  };
  const [isMoveItBackDone, setIsMoveItBackDone] = useState(false);
  const [editText, setEditText] = useState("");
  const [animate, setAnimate] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addIndex, setAddIndex] = useState(null);
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

  useEffect(() => {
    console.log("animate is " + animate);
  }, [animate]);

  useEffect(() => {
    console.log("isDeleting is " + isDeleting);
  }, [isDeleting]);

  useEffect(() => {
    console.log("deleteIndex is " + deleteIndex);
  }, [deleteIndex]);

  //Regular Function↓↓
  function handleAdd() {
    setAnimate(true);
    setIsAdding(true);
    if (!input) {
      alert("タスクを入力してください！");
      return;
    }
    //状態変数を更新↓↓
    if (priority === "2") {
      setTodos((prev) => [
        { text: input, completed: false, priority: "2", id: Date.now() },
        ...prev,
      ]); //Updating setTodos Array (prepending "input" to the todos array)
      setInput(""); //Initializing the "input" (since you pressed the Add button)
      console.log("(at handleAdd) todos=");
      console.log(todos);
    } else if (priority === "1") {
      setTodos((prev) => [
        { text: input, completed: false, priority: "1", id: Date.now() },
        ...prev,
      ]); //Updating setTodos Array (prepending "input" to the todos array)
      setInput(""); //Initializing the "input" (since you pressed the Add button)
      console.log("(at handleAdd) todos=");
      console.log(todos);
    } else {
      setTodos((prev) => [
        { text: input, completed: false, priority: "3", id: Date.now() },
        ...prev,
      ]); //Updating setTodos Array (prepending "input" to the todos array)
      setInput(""); //Initializing the "input" (since you pressed the Add button)
      console.log("(at handleAdd) todos=");
      console.log(todos);
    }
  }

  function removeTask(i, e) {
    setDeleteIndex(i);
    console.log("The remove button clicked!");
    e.stopPropagation();
    setTodos(todos.filter((_, index) => removeCurrentIndex(index)));
    // .filterはcallbackにtrueを返すもののみを残す

    setDeleteIndex(i);

    // the callback関数↓↓
    function removeCurrentIndex(index) {
      console.log(`index!==${i}=${index !== todos[i]}`);
      return index !== i;
      // index が i じゃないものをtrueとして残す(indexがiのアイテムを削除)
    }
  }

  function move_it_back(i, e, id) {
    setIsDeleting(true);
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
    setDeleteIndex(i);
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

  function completeTask(i, e) {
    e.target.checked = false;
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
    setEditText(todos[i].text);
  }

  function saveTask(i) {
    setTodos(
      todos.map((todo, index) => {
        if (index === i) {
          return { ...todo, text: editText };
        }
        return todo;
      }),
    );

    setEditingIndex(null);
  }

  function sort_by_priority() {
    setTodos(
      todos.toSorted((a, b) => {
        return a.priority - b.priority;
      }),
    );
  }

  const show_or_not = { display: doneTodos.length !== 0 ? "block" : "none" };

  return (
    <div className="wholeContainer">
      <div className="upperHalfContainer">
        <div className="devidingContainer1"></div>
        <div className="devidingContainer2">
          <p className="title">タスク管理アプリ</p>
          <div className="input_and_button_container">
            <input
              value={input}
              className="inputField"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
              onChange={(e) => {
                setInput(e.target.value);
              }} /*setting an eventListener*/
              placeholder="やるべきことを入力:例）牛乳を買う"
            />
          </div>
          <div className="pritorityContainer">
            <p className="priority-title">優先度：</p>
            <div className="buttonWrapper">
              <div className="choiceWrapper1">
                <input
                  type="radio"
                  id="priorityChoice1"
                  name="priority"
                  value="1"
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
                  value="2"
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
                  value="3"
                  onChange={(e) => {
                    onOptionChange(e);
                  }}
                  style={{ fontWeight: "500" }}
                />
                <label htmlFor="priorityChoice3">低</label>
              </div>
            </div>
          </div>
        </div>
        <div className="devidingContainer3">
          <button
            onClick={() => {
              handleAdd();
            }}
            className={`add_button ${animate ? "add_buttonPushed" : ""} `}
            onTransitionEnd={() => setAnimate(false)}
          >
            +
          </button>
          <button className="sort_button" onClick={() => sort_by_priority()}>
            優先度順に整列
          </button>
        </div>
      </div>
      <div className="uncompletedListContainer">
        <ul>
          {todos.map((todo, i) => {
            const striken = {
              display: todos[i].completed ? "none" : "flex",
            };
            const priority_style = {
              borderLeft:
                todo.priority === "3"
                  ? "10px blue solid"
                  : todo.priority === "2"
                    ? " 10px yellow solid"
                    : "10px red solid",
            };

            return (
              // the i is how index numbers should be called
              <li
                key={i}
                style={{ ...striken, ...priority_style }}
                id={todo.id}
                className={`
                 ${!isDeleting ? "" : deleteIndex === i ? "smoothDelete" : ""}
                ${!isAdding ? "" : i === 0 ? "smoothAdd" : ""}
                 `}
                onAnimationEnd={() => {
                  setIsDeleting(false);
                  setIsAdding(false);
                }}
              >
                <input
                  type="checkbox"
                  onClick={(e) => {
                    completeTask(i, e);
                    add_completed(i);
                  }}
                ></input>
                {editingIndex === i ? (
                  <input
                    value={editText}
                    onChange={(e) => {
                      setEditText(e.target.value);
                    }}
                  ></input>
                ) : (
                  <span style={{ fontWeight: "500" }}> {todo.text}</span>
                )}

                <button
                  className="edit_button li_button"
                  style={{ fontWeight: "500" }}
                  onClick={() =>
                    editingIndex === i ? saveTask(i) : editTask(i)
                  }
                >
                  {editingIndex === i ? "保存" : "編集"}
                </button>
                <button
                  className=" li_button"
                  onClick={(e) => {
                    setIsDeleting(true);
                    removeTask(i, e);
                  }}
                  style={{ fontWeight: "500" }}
                >
                  削除
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="completedListContainer">
        <div className="show_or_not" style={show_or_not}>
          <p className="sectionTitle">完了したタスク</p>
          <ul>
            {doneTodos.map((todo, i) => {
              const hide = {
                textDecoration: "line-through",
              };
              return (
                <li
                  key={i}
                  onClick={(e) => move_it_back(i, e, todo.id)}
                  id={todo.id}
                  className={`
                 ${!isDeleting ? "" : deleteIndex === i ? "smoothDelete" : ""}
                ${!isAdding ? "" : i === 0 ? "smoothAdd" : ""}
                 `}
                  onAnimationEnd={() => {
                    setIsDeleting(false);
                  }}
                >
                  <input type="checkbox" checked={true} readOnly></input>
                  <span style={hide}>{doneTodos[i].text}</span>
                  <button
                    className=" li_button"
                    onClick={(e) => {
                      removeTask_completed(i, e);
                      setIsDeleting(true);
                    }}
                  >
                    削除
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <ResetButton completed={setDoneTodos} uncompleted={setTodos} />
    </div>
  );
}

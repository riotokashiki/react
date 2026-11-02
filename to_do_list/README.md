# React タスク管理アプリ

こちらは私がReactを使用して製作したTo-Doリストアプリです。（タスク管理アプリ）

## タスクに優先度を割り当て可能

このTo-Doリストアプリはタスクに優先度を割り当てることができます。

例えば　入力フィールドに「牛乳を買う」と入力してください。\
そして\
優先度のラジオボタンを「低」にあわせます。\
次にEnterまたは「＋」ボタンをクリックします。\
すると\
優先度：「低」\
のタスク：\
「牛乳を買う」

をリストに追加できます。\
重要で緊急度の高いタスク、例えば\
「部長にプロジェクトの結果を報告」\
には優先度「高」を設定しましょう。

このアプリを使っていくうちにリストがたまってきます。そうなると何を優先すべきなのかが見づらくなってきます。\
そんな時に便利なのが「優先度順に並べる」のボタンです。\
これをクリックすると、優先度が高い順に上から並べて整列されます。

そうすることで、緊急度の高い＝優先度の高いタスクが一番上に来て一番見やすくなります。

## 完了したタスクは　「完了したタスク」リストへと移動

タスクの左手にある四角いチェックボックスをクリックしていただくと、このタスクは完了したものとみなされ、下の「完了したタスク」リストへと追加されます。\
これは単純に、横線を引いてそのまま放置するよりも確実に視認性がよく、UXが上がるために実装しています。

## localStorageへとデータを保存

作ったリストのデータlocalStorageへと保存されます。\
なので更新ボタンやブラウザを閉じてしまっても再び開けば作ったリストのデータは残っています。\
これは実用性を重視したための実装となります。

## リセットボタン

画面右下に「Reset」ボタンが見えると思います。\
それをクリックしていただくと、タスクが全部削除され、初期状態へと戻ります。

## スムーズなアニメーション

タスク追加時に　緑の「＋」ボタンが押されて凹むアニメーション、\
タスクが追加されるときにググッと生えるようにして追加されるアニメーション、\
そしてタスク削除時にタスクが小さくなって消滅するアニメーション、\
これらのアニメーションはユーザーにとって「自分がアプリを操作している」という実感を与えて直感的で気持ちのいい体験になることを狙って実装しています。



# 以下がコードとなります。

## App.jsx
```react
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

```


## reset_button.jsx
```react

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

```




## App.css
```react
div#root {
  display: flex;
  justify-content: center;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body,
html {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  min-height: 100%;
  background: #3f3f9f;
}

li {
  list-style-type: none;
  width: 51%;
  display: flex;
  justify-content: space-between;
}

ul {
  padding-left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.del_button {
  background-color: red;
}
.container {
  width: 50vw;
}

.inputField {
  width: 90%;
}

.sectionTitle {
  text-align: center;
}

.choiceWrapper1 {
  background-color: rgb(248, 147, 147);
  display: flex;
  flex-direction: column;
  width: 2rem;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.choiceWrapper2 {
  background-color: rgb(243, 248, 147);
  display: flex;
  flex-direction: column;
  width: 2rem;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.choiceWrapper3 {
  background-color: rgb(147, 177, 248);
  display: flex;
  flex-direction: column;
  width: 2rem;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.priority-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.buttonWrapper {
  display: flex;
  overflow: hidden;
  border-radius: 5px;
}
.priority-title {
  display: flex;
  justify-content: center;
  align-items: center;
}
.priorityContainer {
  display: flex;
  justify-content: center;
}

.priority1 {
  border-left: 10px red solid;
}
.priority2 {
  border-left: 10px yellow solid;
}
.priority3 {
  border-left: 10px blue solid;
}

.input_and_button_container {
  display: flex;
}

.add_button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: 0;
  border-bottom: 5px solid #367039;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.03s ease;

  left: 0%;
  max-height: 10vh;
  max-width: 10vh;
  font-size: 1.3rem;
}
.add_button:hover {
  background-color: #78e37b;
  border-bottom: 5px solid #66c26b;
}
.add_buttonPushed {
  background-color: #63c266;
  border-bottom: 0px !important;
  transform: translateY(5px);
  transition: all 0.03s ease;
}

.inputField {
  height: 2rem;
  box-shadow: inset 0px 0px 4px gray;
  border: none;
  padding: 1rem;
  font-size: 0.9rem;
  width: 100%;
}

ul {
  border-radius: 15px;

  max-width: 100%;
  width: 100%;
  overflow: hidden;
  box-shadow: 0px 0px 5px gray;
  background: #a2cce2;
}

li {
  list-style-type: none;
  display: flex;

  padding: 5px 20px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.del_button {
  color: white;
  background: red;
  border-radius: 10px;
  height: 35px;
  width: 50px;
  font-size: 15px;
  text-align: center;
  padding-right: 8px;
  padding-left: 2.5px;
}

button {
  border: none;
  box-shadow: 0px 0px 1px gray;
  color: #4c4c4c;
}
.li_button {
  margin-right: 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  box-shadow: 0px 0px 5px gray;
  background-color: #cfcfcf;
  padding: 0px 5px;
}

span {
  color: black;
  width: 24vw;
  overflow: hidden;
  overflow-wrap: break-word;
  padding: 0 0.5em;
}

.wholeContainer {
  margin: 1rem;
  box-shadow: 0px 0px 5px gray;
  border-radius: 15px;
  min-width: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem 0;
  min-height: 20vh;
  background: #a2d1e6;
  z-index: 1;
}

.devidingContainer3 button {
  font-weight: bold;
  border-radius: 7px;
}

.sort_button {
  border-radius: 0px;
  font-size: 14px;
  padding: 2px;
  display: flex;
  line-height: 100%;
}

.upperHalfContainer {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 17vh;
}

.uncompletedListContainer {
  width: 89%;
  margin: 3rem 0rem;
}
.completedListContainer {
  width: 89%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.devidingContainer2 p {
  text-align: center;
  margin: 0.6rem;
}

.devidingContainer1,
.devidingContainer3 {
  width: 20%;
  height: 100%;
}
.devidingContainer3 {
  position: relative;
  padding-top: 56px;
}

.devidingContainer2 {
  width: 60%;
  height: 100%;
}

.pritorityContainer {
  display: flex;
  justify-content: center;
}
.show_or_not {
  width: 100%;
}

.reset_button {
  width: 6vw;
  margin-left: 77%;
  margin-top: 4%;
}

p.title {
  margin: 1rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  * {
    font-size: 0.9rem;
  }

  .wholeContainer {
    width: 70vw;
  }

  .li_button {
    margin-right: null;
  }

  span {
    width: 32vw;
  }

  .devidingContainer3 {
    padding-top: 48px;
  }
}

@media (max-width: 480px) {
  .li_button {
    font-size: 10px;
    margin: 0;
  }

  * {
    font-size: 0.84rem;
  }

  .wholeContainer {
    width: 85vw;
  }

  .devidingContainer2 p {
    font-size: 0.9rem;
    margin: 0.8rem;
  }

  #inputField {
    font-size: 0.6rem;
  }

  #sort {
    font-size: 0.6rem;
  }
  .devidingContainer3 {
    padding-top: 40px;
  }
}
.smoothDelete {
  animation: smoothDelete 0.25s ease;
}

@keyframes smoothDelete {
  from {
    opacity: 1;
    max-height: 2rem;
  }
  to {
    opacity: 0;
    max-height: 0rem;
  }
}

.smoothAdd {
  animation: growingDown 0.25s ease;
}
@keyframes growingDown {
  from {
    opacity: 0;
    max-height: 0rem;
  }
  to {
    opacity: 1;
    max-height: 2rem;
  }
}
.receivingInCompletedList {
  animation-name: receiving;
  animation-timing-function: ease;
  animation-duration: 0.25s;
}

@keyframes receiving {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
.taskCompleted {
  animation-name: completed;
  animation-timing-function: ease;
  animation-duration: 0.25s;
}
@keyframes completed {
  from {
    opacity: 1;
    max-height: 2rem;
  }
  to {
    opacity: 0;
    max-height: 0rem;
  }
}

```


## Main.css
```react
html,
body {
  display: flex;
  position: relative;
}

.manual {
  position: absolute;
  left: 1rem;
  max-width: 18%;
      letter-spacing: 0.07vw;
}

@media (max-width: 768px) {
div#root {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
  .manual {
    position: static;
            max-width: 80%;
  }
}

@media (max-width: 480px) {
}
```

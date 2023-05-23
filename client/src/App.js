import axios from "axios";
import { useState, useEffect } from "react";
import CreateCardModal from "./components/CreateCardModal";
import Header from "./components/Header";
import RenderCards from "./components/RenderCards";

export default function App(props) {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER}/api/todo`).then((res) => {
      setTodos(res.data.data);
    });
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto my-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-10 md:px-0 px-5">
          <div className="bg-gray-600 p-6 rounded-lg shadow-xl h-fit">
            <h2 className="text-lg text-gray-50 font-black mb-5">Todo</h2>
            <RenderCards setTodos={setTodos} status={0} cards={todos} />
            <CreateCardModal
              todos={todos}
              setTodos={setTodos}
              formId={"createTodoCard"}
              status={0}
            />
          </div>

          <div className="bg-gray-600 p-6 rounded-lg shadow-xl h-fit">
            <h2 className="text-lg text-gray-50 font-black mb-5">
              In progress
            </h2>
            <RenderCards setTodos={setTodos} status={1} cards={todos} />
            <CreateCardModal
              todos={todos}
              setTodos={setTodos}
              formId={"createProgressCard"}
              status={1}
            />
          </div>

          <div className="bg-gray-600 p-6 rounded-lg shadow-xl h-fit">
            <h2 className="text-lg text-gray-50 font-black mb-5">Done</h2>
            <RenderCards setTodos={setTodos} status={2} cards={todos} />
            <CreateCardModal
              todos={todos}
              setTodos={setTodos}
              formId={"createDoneCard"}
              status={2}
            />
          </div>
        </div>
      </div>
    </>
  );
}

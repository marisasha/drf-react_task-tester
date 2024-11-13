// TODO external  //////////////////////////////////////////////////////////////////
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// TODO internal //////////////////////////////////////////////////////////////////
import * as bases from "../components/bases";
import * as utils from "../components/utils";
import * as components from "../components/components";
import * as constants from "../components/constants";
import * as store from "../components/store";
import * as loaders from "../components/loaders";


export default function Page() {
  const dispatch = useDispatch();
  const task = useSelector((state: any) => state.taskList);
  const [data,setData] = useState([])
  const user_id = utils.LocalStorage.get('user_id')

  async function getTask() {
    if (!task.load) {
      components.constructorWebAction(
        dispatch,
        constants.taskList,
        `${constants.host}/api/tasks/${user_id}`,
        "GET",
      );
    }
  }
  useEffect(() => {
    getTask();
  }, []);

  useEffect(() => {
    if (task.data) {
      const newArray: any = [];
      for (let i = 0; i < task.data.length; i += 1) {
          newArray.push(task.data[i]);
      }
      setData(newArray);
    }
  }, [task.data]);



  return (
    <bases.Base1>
      <div className="flex items-center flex-col gap-y-10 mt-20 w-full">
        <h3 className="text-4xl font-bold leading-9 tracking-tight text-slate-50 mb-10">
          Мои задачи:
        </h3>
        {!task.load ? (
          <div className="flex flex-col justify-center items-center w-2/3">
            {data.map((item: any) =>
              !item.task_stages_complited.is_check ? (
                <div key={item.id} className="rounded text-slate-800 w-full">
                  <div className="category flex flex-col bg-white rounded w-full h-80 mb-10 pt-10">
                    <div className="flex gap-x-16 justify-center">
                      <div className="flex flex-col gap-y-1 items-center">
                        <span className="text-green-500 text-xl mb-2">
                          ⊛Задача создана
                        </span>
                        <span className="text-slate-900 text-sm mb-2">
                          {new Date(item.creation_date).toLocaleString("ru-RU")}
                        </span>
                        <span className="text-slate-900 text-xl mb-2 mt-10">
                          {item.entrants_of_task.author}
                        </span>
                      </div>

                      <div className="flex flex-col gap-y-1 items-center">
                        <span className="text-green-500 text-xl mb-2">
                          ⊛Назначен исполнитель
                        </span>
                        <span className="text-slate-900 text-sm mb-2">
                          {new Date(item.creation_date).toLocaleString("ru-RU")}
                        </span>
                        <span className="text-slate-900 text-xl mb-2 mt-10">
                          {item.entrants_of_task.executor}
                        </span>
                      </div>

                      {item.task_stages_complited.is_completion ? (
                        <div className="flex flex-col gap-y-1 items-center">
                          <span className="text-green-500 text-xl mb-2">
                            ⊛Задача выполнена
                          </span>
                          <span className="text-slate-900 text-sm mb-2">
                            {new Date(
                              item.task_report.completion_date
                            ).toLocaleString("ru-RU")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-y-1 items-center">
                          <span className="text-yellow-500 text-xl mb-2">
                            ⊛Ожидает выполнения
                          </span>
                          <span className="text-slate-900 text-l mb-2">...</span>
                        </div>
                      )}

                      {item.task_stages_complited.is_check ? (
                        <div className="flex flex-col gap-y-1 items-center">
                          <span className="text-green-500 text-xl mb-2">
                            ⊛Задача проверена
                          </span>
                          <span className="text-slate-900 text-sm mb-2">
                            {item.task_check.length > 0
                              ? new Date(
                                  item.task_check[
                                    item.task_check.length - 1
                                  ].check_date
                                ).toLocaleString("ru-RU")
                              : "Дата не указана"}
                          </span>
                          <span className="text-slate-900 text-xl mb-2 mt-10">
                            {item.entrants_of_task.inspector}
                          </span>
                        </div>
                      ) : !item.task_stages_complited.is_completion ? (
                        <div className="flex flex-col gap-y-1 items-center">
                          <span className="text-yellow-500 text-xl mb-2">
                            ⊛Ожидает выполнения
                          </span>
                          <span className="text-slate-900 text-l mb-2">...</span>
                          <span className="text-slate-900 text-xl mb-2 mt-10">
                            {item.entrants_of_task.inspector}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-y-1 items-center">
                          <span className="text-yellow-500 text-xl mb-2">
                            ⊛Ожидает проверки
                          </span>
                          <span className="text-slate-900 text-l mb-2">...</span>
                          <span className="text-slate-900 text-xl mb-2 mt-10">
                            {item.entrants_of_task.inspector}
                          </span>
                        </div>
                      )}
                    </div>
                    <hr className="mt-2 mb-2" />
                    <span className="text-slate-900 text-xl mb-2 ml-10 mr-10">
                      Задание : {item.task_text}
                    </span>
                    <div className="flex gap-x-2 justify-center">
                    <div className="flex justify-center mt-5">
                        <Link
                          to={`/report/${item.id}`}
                          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                        >
                          Посмотреть отчет
                        </Link>
                    </div>
                    {item.entrants_of_task.executor_id === user_id ? (
                      !item.task_stages_complited.is_completion ? (
                        <div className="flex justify-center mt-5">
                          <Link
                            to={`/create_report/${item.id}`}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                          >
                            Сделать отчет
                          </Link>
                        </div>
                      ) : (
                        <div className="flex justify-center mt-5">
                          <Link
                            to={`/create_report/${item.id}`}
                            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
                          >
                            Изменить отчет
                          </Link>
                        </div>
                      )
                    ) : item.task_stages_complited.is_completion ? (
                      <div className="flex justify-center mt-5">
                        <Link
                          to={`/report_check/${item.id}`}
                          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        >
                          Проверить отчет
                        </Link>
                      </div>
                    ) : (
                      <div className="flex justify-center mt-5">
                        <div className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600">
                          Ожидание выполнения
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </bases.Base1>
  );
}
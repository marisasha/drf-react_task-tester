import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as bases from "../components/bases";
import * as utils from "../components/utils";
import * as constants from "../components/constants";
import * as components from "../components/components";
import * as loaders from "../components/loaders";

export default function AssignTaskPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const taskCreation = useSelector((state: any) => state.taskCreat || { load: false, error: null, fail: null, data: null });
    const rolesData = useSelector((state: any) => state.roleList);     
    
    const userId = utils.LocalStorage.get('user_id'); 
    const [form, setForm] = useState({
        user_id: userId,
        executor: "",
        inspector: "",
        comments: ""
    });
    const [data, setData] = useState({ authors: [], executors: [], inspectors: [] });

    async function fetchRolesData() {
        //@ts-ignore
        components.constructorWebAction(
            dispatch,
            //@ts-ignore
            constants.roleList,
            //@ts-ignore
            `${constants.host}/api/create/task`,
            "GET",
        );
    }

    function sendForm(event:any) {
        event.preventDefault();
        console.log(form);

        if (!taskCreation.load) {
            const formData = new FormData();
            formData.append('author_id', form.user_id);
            formData.append('executor_id', form.executor);
            formData.append('inspector_id', form.inspector);
            formData.append('task_text', form.comments);
            //@ts-ignore
            components.constructorWebAction(
                dispatch,
                //@ts-ignore
                constants.taskCreate,
                //@ts-ignore
                `${constants.host}/api/create/task/`,
                "POST",
                formData,
                10000,
                true,
            ).then(() => {
                navigate("/tasks"); 
            });
        }
    }
    //@ts-ignore
    const handleExecutorChange = (event) => {
        setForm({ ...form, executor: event.target.value });
    };
    //@ts-ignore
    const handleInspectorChange = (event) => {
        setForm({ ...form, inspector: event.target.value });
    };
    //@ts-ignore
    const handleCommentsChange = (event) => {
        setForm({ ...form, comments: event.target.value });
    };

    useEffect(() => {
        fetchRolesData();
    }, []);

    useEffect(() => {
        if (rolesData && rolesData.data) {
            setData(rolesData.data);
        }
    }, [rolesData]);

    useEffect(() => {
        if (taskCreation.data) {
            setTimeout(() => {
                navigate("/tasks");
            }, 2000);
        }
    }, [taskCreation]);
    return (
        <bases.Base1>
            <div className="flex flex gap-y-10 mx-20 mt-20 pt-10 rounded-lg items-center box-border ml-96">
                <div>
                <h3 className="text-4xl font-bold leading-9 tracking-tight text-slate-50 m-auto">
                    Назначение задачи:
                </h3>
                <form className={""} onSubmit={sendForm}>
                    <div>
                        <label className="block text-sm font-semibold leading-6 text-slate-50">Выберите исполнителя:</label>
                        <select
                            onChange={handleExecutorChange}
                            required
                            className="block w-96 rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 ext-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm p-2"
                        >
                            <option value="">--Выберите исполнителя--</option>
                            {data.executors.map((executor: any) => (
                                <option key={executor.id} value={executor.id}>
                                    {executor.surname} {executor.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold leading-6 text-slate-50">Выберите проверяющего:</label>
                        <select
                            onChange={handleInspectorChange}
                            required
                            className="block w-96 rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 ext-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm p-2"
                        >
                            <option value="">--Выберите проверяющего--</option>
                            {data.inspectors.map((inspector: any) => (
                                <option key={inspector.id} value={inspector.id}>
                                    {inspector.surname} {inspector.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold leading-6 text-slate-50">Текст задачи:</label>
                        <textarea
                            onChange={handleCommentsChange}
                            value={form.comments}
                            required
                            placeholder="Введите комментарии..."
                            className="block w-96 h-96 rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 text-slate-500 focus:ring-2 resize-none focus:ring-inset focus:ring-indigo-600 sm:text-sm p-2"
                        />
                    </div>
                    <input type="hidden" name="user_id" value={form.user_id} />
                    
                    <article>
                        <loaders.Loader1 isView={taskCreation.load} />
                            {taskCreation.error && (
                            <div className="alert alert-danger" role="alert">
                                {taskCreation.error}
                            </div>
                            )}
                            {taskCreation.fail && (
                            <div className="alert alert-danger" role="alert">
                                {taskCreation.fail}
                            </div>
                            )}
                            {taskCreation.data && (
                            <div className="w-full h-12 bg-green-500 text-slate-50  text-bold text-m rounded mt-3 flex items-center justify-center font-semibold" role="alert">
                                Задача успешно создана
                            </div>
                            )}
                        </article>

                    <div className="mt-3 m-auto flex justify-center">
                        <button type="submit" className="flex w-60 justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Создать задачу
                        </button>
                    </div>
                </form>
                </div>
            </div>
        </bases.Base1>
    );
}
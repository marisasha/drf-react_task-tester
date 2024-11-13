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
    const changeRole = useSelector((state: any) => state.changeRole || { load: false, error: null, fail: null, data: null });
    const roleUsers = useSelector((state: any) => state.roleUsers);
    const [data, setData] = useState<any[]>([]);
    
    const userId = utils.LocalStorage.get("user_id");
    const [form, setForm] = useState({
        user_id: userId,
        selectedUser: "",
        selectedRole: "",
        action: ""
    });

    async function getUsers() {
            if (!changeRole.load) {
            components.constructorWebAction(
                dispatch,
                constants.roleUsers,
                `${constants.host}/api/change/role`,
                "GET",
            );
            }
        }

useEffect(() => {
    getUsers();
}, []);
useEffect(() => {
    if (roleUsers.data) {
        setData(roleUsers.data);
    }
    }, [roleUsers.data]);

    function sendForm(event: any) {
        event.preventDefault();
        console.log(form);

        if (!changeRole.load) {
            const formData = new FormData();
            formData.append("user_id", form.selectedUser);
            formData.append("role", form.selectedRole);
            formData.append("action", form.action); 

            //@ts-ignore
            components.constructorWebAction(
                dispatch,
                //@ts-ignore
                constants.taskCreate,
                //@ts-ignore
                `${constants.host}/api/change/role`,
                "POST",
                formData,
                10000,
                true
            ).then(() => {
                navigate("/tasks"); 
            });
        }
    }

    const handleUserChange = (event: any) => setForm({ ...form, selectedUser: event.target.value });
    const handleRoleChange = (event: any) => setForm({ ...form, selectedRole: event.target.value });
    const handleActionChange = (event: any) => setForm({ ...form, action: event.target.value });

    return (
        <bases.Base1>
            <div className="flex flex gap-y-10 mx-20 mt-20 pt-10 rounded-lg items-center box-border ml-96">
                <div>
                    <h3 className="text-4xl font-bold leading-9 tracking-tight text-slate-50 m-auto">
                        Назначение роли:
                    </h3>
                    <form className={""} onSubmit={sendForm}>
                    <div>
                        <label className="block text-sm font-semibold leading-6 text-slate-50">Выберите сотрудника:</label>
                        <select
                            onChange={handleUserChange}
                            required
                            className="block w-96 rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 ext-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm p-2"
                        >
                            <option value="">--Выберите сотрудника--</option>
                            {data.map((user: any) => (
                                user.profile ? (
                                    <option key={user.id} value={user.id}>
                                        {user.profile.surname} {user.profile.name}
                                    </option>
                                ) : null 
                            ))}
                        </select>
                    </div>
                        
                        <div>
                            <label className="block text-sm font-semibold leading-6 text-slate-50">Выберите роль:</label>
                            <select
                                onChange={handleRoleChange}
                                required
                                className="block w-96 rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 ext-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm p-2"
                            >
                                <option value="">--Выберите роль--</option>
                                <option value="inspector">Проверяющий</option>
                                <option value="author">Автор</option>
                                <option value="boss">Босс</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold leading-6 text-slate-50">Выберите действие:</label>
                            <select
                                onChange={handleActionChange}
                                required
                                className="block w-96 rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 ext-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm p-2"
                            >
                                <option value="">--Выберите действие--</option>
                                <option value="assign">Назначить роль</option>
                                <option value="remove">Забрать роль</option>
                            </select>
                        </div>
                        <article>
                            <loaders.Loader1 isView={changeRole.load} />
                            {changeRole.error && (
                                <div className="alert alert-danger" role="alert">
                                    {changeRole.error}
                                </div>
                            )}
                            {changeRole.fail && (
                                <div className="alert alert-danger" role="alert">
                                    {changeRole.fail}
                                </div>
                            )}
                            {changeRole.data && (
                                <div
                                    className="w-full h-12 bg-green-500 text-slate-50 text-bold text-m rounded mt-3 flex items-center justify-center font-semibold"
                                    role="alert"
                                >
                                    Роль успешно обновлена
                                </div>
                            )}
                        </article>
                        <div className="mt-3 m-auto flex justify-center">
                            <button
                                type="submit"
                                className="flex w-60 justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Обновить роль
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </bases.Base1>
    );
}
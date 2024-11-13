import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as bases from "../components/bases";
import * as utils from "../components/utils";
import * as constants from "../components/constants";
import * as components from "../components/components";
import * as loaders from "../components/loaders";
import { Link } from "react-router-dom";

export default function Page() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userLogin = useSelector((state: any) => state.userLogin);
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    function sendForm(event: any) {
        event.preventDefault();

        if (form.password !== "" && !userLogin.load) {
        components.constructorWebAction(
            dispatch,
            constants.userLogin,
            `${constants.host}/api/token/`,
            "POST",
            { username: form.username, password: form.password },
            10000,
            true,
        );
        } else {
        window.alert("Заполните пароль!");
        }
    }

    useEffect(() => {
        if (userLogin && userLogin.data) {
        utils.LocalStorage.set("userLogin.data.access", userLogin.data.access);
        utils.LocalStorage.set("userLogin.data.refresh", userLogin.data.refresh);
        utils.LocalStorage.set("user_id", userLogin.data.user_id);
        setTimeout(() => {
            navigate("/tasks");
        }, 2000);
        }
    }, [userLogin]);

    useEffect(() => {
        if (constants.isDebug) {
        console.log("userLogin: ", userLogin);
        }
    }, [userLogin]);

    return (
            <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-20">
                <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-slate-50">Войдите в свой аккаунт</h2>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className={""} onSubmit={sendForm}>
                    <div>
                        <label htmlFor="email" className="block text-m font-semibold leading-6 text-slate-50" >Логин: </label>
                        <div className="mt-2">
                            <input onChange={(event) => setForm({ ...form, username: event.target.value })}  placeholder="Email" required className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-m font-semibold leading-6 text-slate-50">Пароль:</label>
                        <div className="mt-2">
                            <input id="password" onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" name="password" type="password" required className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"/>
                        </div>
                    </div>
                    <article>
                        <loaders.Loader1 isView={userLogin.load} />
                        {userLogin.error && (
                        <div className="alert alert-danger" role="alert">
                            {userLogin.error}
                        </div>
                        )}
                        {userLogin.fail && (
                        <div className="alert alert-danger" role="alert">
                            {userLogin.fail}
                        </div>
                        )}
                        {userLogin.data && (
                        <div className="w-full h-12 bg-green-500 text-slate-50  text-bold text-m rounded mt-3 flex items-center justify-center font-semibold" role="alert">
                            Вы успешно вошли в аккаунт!
                        </div>
                        )}
                    </article>
                    <div className="mt-10">
                        <button type="submit" className="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ">Войти</button>
                        <span className="block text-m font-semibold leading-6 text-slate-50" > У вас еще нет аккаунта ?<Link to = {"/register"} className="text-yellow-500 hover:text-gray-600"> Зарегистрируйтесь </Link></span>
                    </div>
                    <span>Аккаунт с админкой - login: pc ; password : 123</span>
                </form>
                </div>
                </div>
    );
    }
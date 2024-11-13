import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as utils from "../components/utils";
import * as components from "../components/components";
import * as constants from "../components/constants";

export function Navbar() {
  const roleList = useSelector((state: any) => state.roleList);
  const dispatch = useDispatch();
  const userId = utils.LocalStorage.get("user_id");

  const [isAuthor, setAuthorRole] = useState<string | null>(null);
  const [isBoss, setBossRole] = useState<string | null>(null);

  async function fetchRolesData() {
    //@ts-ignore
    components.constructorWebAction(
      dispatch,
      //@ts-ignore
      constants.roleList,
      //@ts-ignore
      `${constants.host}/api/create/task/`,
      "GET"
    );
  }

  useEffect(() => {
    fetchRolesData();
  }, []);

  useEffect(() => {
    if (roleList && roleList.data) {
      console.log("Роли загружены:", roleList.data); 
      const { authors, executors, inspectors ,boss} = roleList.data;

      const userIsAuthor = authors.some((author: any) => author.id === userId);
      const userIsBoss = boss.some((author: any) => author.id === userId);
      console.log("Пользователь автор:", userIsAuthor); 

      if (userIsAuthor) {
        setAuthorRole("author");
      }
      if (userIsBoss) {
        setBossRole("boss");
      } 
    }
  }, [roleList, userId]);


  return (
    <nav className="m-0 flex flex-col justify-between w-1/6 fixed top-0 left-0 h-full" aria-label="Global">
      <div className="flex flex-col ml-20 mr-20 gap-y-10">
        <div className="flex flex-col text-5xl font-semibold leading-6 text-yellow-500 hover:text-gray-600 gap-y-2 mt-10 mb-32">
          <span>Ta$k</span>
          <span>Treker</span>
        </div>

        <div className="flex gap-x-12 items-center">
          <Link to="/tasks" className="text-xl font-semibold leading-6 text-slate-50 hover:text-gray-600 flex gap-x-2 items-center">
            <i className="fa-solid fa-list-check"></i>
            <span>Все задачи</span>
          </Link>
        </div>
        <div className="flex gap-x-12 items-center">
          <Link to="/my_tasks" className="text-xl font-semibold leading-6 text-slate-50 hover:text-gray-600 flex gap-x-2 items-center ">
            <i className="fa-sharp-duotone fa-solid fa-list-check"></i>
            <span>Мои задачи</span>
          </Link>
        </div>
        <div className="flex gap-x-12 items-center">
          <Link to="/archive_tasks" className="text-xl font-semibold leading-6 text-slate-50 hover:text-gray-600 flex gap-x-2 items-center ">
            <i className="fa-sharp-duotone fa-solid fa-list-check"></i>
            <span>Архив</span>
          </Link>
        </div>

        {isAuthor === "author" ? (
          <div className="flex gap-x-12 items-center">
            <Link to="/create_task" className="text-xl font-semibold leading-6 text-slate-50 hover:text-gray-600 flex gap-x-2 items-center">
              <i className="fa-solid fa-list-check"></i>
              <span>Создать задачу</span>
            </Link>
          </div>
        ) : (
          ""
        )}
        {isBoss === "boss" ? (
          <div className="flex gap-x-12 items-center mb-10">
            <Link to="/change_role" className="text-xl font-semibold leading-6 text-slate-50 hover:text-gray-600 flex gap-x-2 items-center">
              <i className="fa-solid fa-list-check"></i>
              <span>Назначить роль </span>
            </Link>
          </div>
        ) : (
          <div className="mb-30"></div>
        )}

        <div className="flex flex-col gap-y-2 w-48 h-16 justify-center mt-96">
          <Link to="/logout" className="flex gap-x-2 text-xl font-semibold leading-6 text-slate-50 hover:text-red-600 flex gap-x-2 items-center">
            <i className="fa-solid fa-right-from-bracket m-0"></i>
            Выйти из аккаунта
          </Link>
        </div>
      </div>
    </nav>
  );
}
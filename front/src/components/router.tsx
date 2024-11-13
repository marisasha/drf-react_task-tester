// external
import { BrowserRouter, Routes, Route } from "react-router-dom";

// base
import Tasks from "../pages/Tasks";
import UserTasks from "../pages/UserTasks";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Register from "../pages/Register";
import CreateTask from "../pages/CreateTask";
import CreateReport from "../pages/CreateReport";
import ReportCheck from "../pages/ReportCheck";
import ReportOnlyCheck from "../pages/ReportOnlyCheck";
import ChangeRole from "../pages/ChangeRole";
import TaskArchive from "../pages/TaskArchive";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* base */}
        <Route path={"tasks/"} element={<Tasks />}></Route>
        <Route path={"my_tasks/"} element={<UserTasks />}></Route>
        <Route path={"archive_tasks/"} element={<TaskArchive />}></Route>
        <Route path={"create_task/"} element={<CreateTask />} />
        <Route path={"create_report/:id"} element={<CreateReport />} />
        <Route path={"report_check/:id"} element={<ReportCheck />} />
        <Route path={"report/:id"} element={<ReportOnlyCheck />} />
        <Route path={"change_role/"} element={<ChangeRole />} />
        <Route path={"register/"} element={<Register />}></Route>
        <Route path={"/"} element={<Login />}></Route>
        <Route path={"logout/"} element={<Logout />}></Route>

        {/* safe redirect */}
        <Route path={"*"} element={<Tasks/>}></Route> 
      </Routes>
    </BrowserRouter>
  );
}
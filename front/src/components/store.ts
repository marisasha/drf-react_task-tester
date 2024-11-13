import { configureStore } from "@reduxjs/toolkit";
import * as components from "./components";
import * as constants from "./constants";
export const store = configureStore({
  reducer: {
    
    // @ts-ignore
    taskList: components.constructorReducer(constants.taskList),
    // @ts-ignore
    taskCreate: components.constructorReducer(constants.taskCreate),
    // @ts-ignore
    roleList: components.constructorReducer(constants.roleList),
    // @ts-ignore
    taskResponse: components.constructorReducer(constants.taskResponse),
    // @ts-ignore
    taskDelete: components.constructorReducer(constants.taskDelete),
    // @ts-ignore
    taskToArchive: components.constructorReducer(constants.taskToArchive),
    // @ts-ignore
    changeRole: components.constructorReducer(constants.changeRole),
    // @ts-ignore
    roleUsers: components.constructorReducer(constants.roleUsers),
    // @ts-ignore
    userRegister: components.constructorReducer(constants.userRegister),
    // @ts-ignore
    userLogin: components.constructorReducer(constants.userLogin),
    // @ts-ignore
    userUpdate: components.constructorReducer(constants.userUpdate),
    // @ts-ignore
    userProfile: components.constructorReducer(constants.userProfile),
    
  },
});
export default store;

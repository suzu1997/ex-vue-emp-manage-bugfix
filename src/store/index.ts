import Vue from "vue";
import Vuex from "vuex";
import { Employee } from "@/types/employee";
import config from "@/const/const";
// 使うためには「npm install axios --save」を行う
import axios from "axios";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    totalEmployeeCount: 0,
    employees: new Array<Employee>(),
    token: false,
  }, // end state
  actions: {
    /**
     * 従業員一覧情報をWebAPIから取得してmutationを呼び出す.
     *
     * @param context コンテキスト
     */
    async getEmployeeList(context) {
      // WebAPIから従業員一覧情報を取得する
      const response = await axios.get(
        `${config.EMP_WEBAPI_URL}/employee/employees`
      );
      // 取得したJSONデータをコンソールに出力して確認
      console.dir("response:" + JSON.stringify(response));
      // 取得したresponseデータの中のdataを取り出してpayload変数に格納する
      const payload = response.data;
      // showEmployeeListという名前のミューテーションを呼び出す
      // (contextオブジェクトのcommitメソッドを呼び出す)
      // その際、先程payload変数に格納したデータを第２引数に渡す
      context.commit("showEmployeeList", payload);
    },
  }, // end actions
  mutations: {
    /**
     * 従業員一覧情報を作成してstateに格納する.
     *
     * @param context コンテキスト
     * @param payload WebAPIから取得した従業員情報(JSON)
     */
    showEmployeeList(state, payload) {
      // console.dir("payload:" + JSON.stringify(payload));
      console.log("totalEmployeeCount:" + payload.totalEmployeeCount);
      // payloadの中(WebAPIから取得したJSON)のtotalEmployeeCountをstateのtotalEmployeeCountに代入する
      state.totalEmployeeCount = payload.totalEmployeeCount;
      // payloadの中(WebAPIから取得したJSON)のemployeesをstateのemployeesに代入する
      // state.employees = payload.employees;
      // 初期化(やらないと従業員一覧表示するたびに追加されていくため)
      state.employees = new Array<Employee>();
      // 今回EmployeeオブジェクトのformatHireDateメソッドを
      // 使用するため、Employeeオブジェクトの配列に変換する必要あり
      for (const employee of payload.employees) {
        state.employees.push(
          new Employee(
            employee.id,
            employee.name,
            employee.image,
            employee.gender,
            employee.hireDate,
            employee.mailAddress,
            employee.zipCode,
            employee.address,
            employee.telephone,
            employee.salary,
            employee.characteristics,
            employee.dependentsCount
          )
        );
      }
      // 従業員一覧を入社日の降順でソートする.
      state.employees.sort((a, b) => {
        if (a.hireDate < b.hireDate) {
          return 1;
        } else {
          return -1;
        }
      });
    },
    /**
     * ログイン状態をtrueにする.
     * 
     * @param state - ステート
     */
    login(state) {
      state.token = true;
    },
    /**
     * ログイン状態をfalseにする.
     * 
     * @param state - ステート
     */
    logout(state) {
      state.token = false;
    }
  }, // end mutations
  getters: {
    /**
     * 全従業員数を返す.
     *
     * @param state ステート
     * @returns 従業員数
     */
    getAllEmployeeCount(state) {
      return state.totalEmployeeCount;
    },
    /**
     * 全従業員一覧を返す.
     *
     * @param state ステート
     * @returns 従業員一覧情報
     */
    getAllEmployees(state) {
      return state.employees;
    },
    /**
     * IDから従業員を検索し返す.
     *
     * @param state ステート
     * @returns 従業員情報
     */
    getEmployeeById(state) {
      // 渡されたIDで絞り込んだEmployeeオブジェクトを1件返す
      return (employeeId: number) => {
        const employees = state.employees.filter(
          (employee) => employee.id == employeeId
        );
        return employees[0];
      };
    },
    /**
     * 従業員を名前で部分一致検索をする.
     *
     * @param state ステート
     * @returns 部分一致検索で検索された従業員一覧情報
     */
    getSearchEmployeeByName(state) {
      // 部分一致で絞り込んだemployeeオブジェクトのみを返す
      return (name: string) => {
        return state.employees.filter((employee) =>
          employee.name.includes(name)
        );
      };
    },
    /**
     * ログイン済みかどうかを返す.
     * 
     * @param state - ステート
     * @returns ログイン済みかどうかのフラグ
     */
    getIsLogin(state) {
      return state.token;
    }

  }, // end getters
  plugins: [
    createPersistedState({
      key: "token",
      paths: ["token"],
      storage: window.sessionStorage,
    }),
  ],
});

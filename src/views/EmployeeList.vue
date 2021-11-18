<template>
  <div class="container">
    <!-- パンくずリスト -->
    <nav>
      <div class="nav-wrapper">
        <div class="col s12 teal">
          <a class="breadcrumb">従業員リスト</a>
        </div>
      </div>
    </nav>
    <form class="col s12" id="reg-form">
      <div class="row">
        <div class="input-field col s6">
          <input
            id="search"
            type="text"
            class="validate"
            v-model="searchInput"
          />
          <label for="search">従業員名で検索</label>
        </div>
        <button
          class="btn waves-effect waves-light"
          type="button"
          v-on:click="searchEmployees"
        >
          検索
        </button>
      </div>
      <div class="searchMessage">{{ searchMessage }}</div>
    </form>
    <div>従業員数:{{ getEmployeeCount }}人</div>
    <div class="row">
      <table class="striped">
        <thead>
          <tr>
            <th>名前</th>
            <th>入社日</th>
            <th>扶養人数</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="employee of displayEmployees" v-bind:key="employee.id">
            <td>
              <router-link :to="'/employeeDetail/' + employee.id">{{
                employee.name
              }}</router-link>
            </td>
            <td>{{ employee.formattedHireDate }}</td>
            <td>{{ employee.dependentsCount }}人</td>
          </tr>
        </tbody>
      </table>
    </div>
    <button
      class="paging-btn"
      v-on:click="goPrevPage"
      :disabled="this.currentPage === 1"
    >
      &lt;
    </button>
    <button
      v-for="num of pageNum"
      :key="num"
      class="paging-btn"
      :class="{ active: num === currentPage }"
      v-on:click="changePage(num)"
    >
      {{ num }}
    </button>
    <button
      class="paging-btn"
      v-on:click="goNextPage"
      :disabled="this.currentPage === this.pageNum"
    >
      &gt;
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Employee } from "@/types/employee";
/**
 * 従業員一覧を表示する画面.
 */
@Component
export default class EmployeeList extends Vue {
  // 従業員一覧
  private currentEmployeeList: Array<Employee> = [];
  // 従業員数
  private employeeCount = 0;
  // ページ数
  private pageNum = 0;
  // 現在のページ
  private currentPage = 1;
  // 一ページあたりの表示件数
  private employeeNumPerPage = 10;
  // 検索する文字列
  private searchInput = "";
  // 検索結果メッセージ
  private searchMessage = "";

  /**
   * Vuexストアのアクション経由で非同期でWebAPIから従業員一覧を取得する.
   *
   * @remarks
   * Vueインスタンスが生成されたタイミングで
   * Vuexストア内のアクションを呼ぶ(ディスパッチする)。
   * ライフサイクルフックのcreatedイベント利用。
   *
   * 取得してからゲットするため、async awaitを利用している。
   */
  async created(): Promise<void> {
    await this.$store.dispatch("getEmployeeList");

    // 従業員一覧情報をVuexストアから取得
    // 非同期で外部APIから取得しているので、async/await使わないとGetterで取得できない
    this.currentEmployeeList = this.$store.getters.getAllEmployees;
    // ページ数を計算
    this.calcPageNum();
  }
  /**
   * ページング処理を行う.
   */
  changePage(num: number): void {
    this.currentPage = num;
  }
  /**
   * 前のページへ移動.
   */
  goPrevPage(): void {
    this.currentPage = this.currentPage - 1;
  }
  /**
   * 次のページへ移動.
   */
  goNextPage(): void {
    this.currentPage = this.currentPage + 1;
  }
  /**
   * ページ数を計算.
   */
  calcPageNum(): void {
    this.pageNum = Math.ceil(this.getEmployeeCount / this.employeeNumPerPage);
  }
  /**
   * 従業員名で検索する.
   */
  searchEmployees(): void {
    this.searchMessage = "";
    this.currentEmployeeList = this.$store.getters.getSearchEmployeeByName(
      this.searchInput
    );
    if (this.getEmployeeCount === 0) {
      this.searchMessage = "１件もありませんでしたので全件表示します";
      this.currentEmployeeList = this.$store.getters.getAllEmployees;
    }
  }
  /**
   * 現在表示されている従業員一覧の数を返す.
   *
   * @returns 現在表示されている従業員一覧の数
   */
  get getEmployeeCount(): number {
    return this.currentEmployeeList.length;
  }
  /**
   * 表示する従業員一覧を取得し返す.
   *
   * @returns ページの従業員一覧
   */
  get displayEmployees(): Array<Employee> {
    // 表示したい配列部分の開始、終了インデックスを計算
    const startIndex = (this.currentPage - 1) * this.employeeNumPerPage;
    const endIndex = startIndex + this.employeeNumPerPage;

    return this.currentEmployeeList.slice(startIndex, endIndex);
  }
}
</script>

<style scoped>
.paging-btn {
  padding: 8px 15px;
  margin-right: 8px;
  margin-bottom: 8px;
}
.active {
  background-color: rgb(49, 206, 145);
}
</style>

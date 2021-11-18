<template>
  <div class="container">
    <div class="row register-page">
      <form class="col s12" id="reg-form">
        <div class="row">
          <div class="input-field col s6">
            <input
              id="last_name"
              type="text"
              class="validate"
              v-model="lastName"
              required
            />
            <div class="error" v-if="lastNameError">※姓を入力してください</div>
            <label for="last_name">姓</label>
          </div>
          <div class="input-field col s6">
            <input
              id="first_name"
              type="text"
              class="validate"
              v-model="firstName"
              required
            />
            <div class="error" v-if="firstNameError">※名を入力してください</div>
            <label for="first_name">名</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              id="email"
              type="email"
              class="validate"
              v-model="mailAddress"
              required
            />
            <div class="error" v-if="mailAddressError">
              ※メールアドレスを入力してください
            </div>
            <label for="email">メールアドレス</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s5">
            <input
              id="zipcode"
              type="text"
              class="validate"
              v-model="zipcode"
              required
            />
            <div class="error" v-if="zipcodeError">
              ※郵便番号を入力してください
            </div>
            <label for="zipcode">郵便番号</label>
          </div>
          <button
            class="btn waves-effect waves-light addressSearchBtn"
            type="button"
            v-on:click="searchAddress"
          >
            住所検索
          </button>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              id="address"
              type="text"
              class="validate"
              v-model="address"
              required
            />
            <div class="error" v-if="addressError">
              ※住所を入力してください
            </div>
            <label for="address" :class="{ active: address }">住所</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              id="password"
              type="password"
              class="validate"
              minlength="8"
              v-model="password"
              required
            />
            <div class="error" v-if="passwordError">
              ※パスワードを入力してください
            </div>
            <label for="password">パスワード</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input
              id="confirmationPassword"
              type="password"
              class="validate"
              minlength="8"
              v-model="confirmationPassword"
              required
            />
            <div class="error">
              {{ confirmationPasswordError }}
            </div>
            <label for="confirmationPassword">確認用パスワード</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s6">
            <button
              class="btn btn-large btn-register waves-effect waves-light"
              type="button"
              v-on:click="registerAdmin"
            >
              登録
              <i class="material-icons right">done</i>
            </button>
            <div class="error" v-if="registerError">登録できませんでした</div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import config from "@/const/const";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axiosJsonpAdapter = require("axios-jsonp");

/**
 * 管理者登録をする画面.
 */
@Component
export default class RegisterAdmin extends Vue {
  // 姓
  private lastName = "";
  // 名
  private firstName = "";
  // メールアドレス
  private mailAddress = "";
  // 郵便番号
  private zipcode = "";
  // 住所
  private address = "";
  // パスワード
  private password = "";
  // 確認用パスワード
  private confirmationPassword = "";
  // 姓の未入力エラー
  private lastNameError = false;
  // 名の未入力エラー
  private firstNameError = false;
  // メールアドレスの未入力エラー
  private mailAddressError = false;
  // 郵便番号の未入力エラー
  private zipcodeError = false;
  // 住所の未入力エラー
  private addressError = false;
  // パスワードの未入力エラー
  private passwordError = false;
  // 確認用パスワードのエラー
  private confirmationPasswordError = "";
  // 管理者登録エラー
  private registerError = false;

  /**
   * 管理者情報を登録する.
   *
   * @remarks
   * 本メソッドは非同期でWebAPIを呼び出し管理者登録をするためasync/await axiosを利用しています。これらを利用する場合は明示的に戻り値にPromiseオブジェクト型を指定する必要があります。
   * @returns Promiseオブジェクト
   */
  async registerAdmin(): Promise<void> {
    if (this.hasInputErrors()) {
      return;
    }
    // 管理者登録処理
    const response = await axios.post(`${config.EMP_WEBAPI_URL}/insert`, {
      name: this.lastName + " " + this.firstName,
      mailAddress: this.mailAddress,
      password: this.password,
      address: this.address,
    });
    console.dir("response:" + JSON.stringify(response));

    if (response.data.status === "error") {
      this.registerError = true;
      return;
    }

    this.$router.push("/loginAdmin");
  }

  /**
   * 入力値をチェックする.
   */
  hasInputErrors(): boolean {
    this.lastNameError = false;
    this.firstNameError = false;
    this.mailAddressError = false;
    this.zipcodeError = false;
    this.passwordError = false;
    this.addressError = false;
    this.confirmationPasswordError = "";
    let hasError = false;

    if (this.lastName === "") {
      this.lastNameError = true;
      hasError = true;
    }
    if (this.firstName === "") {
      this.firstNameError = true;
      hasError = true;
    }
    if (this.mailAddress === "") {
      this.mailAddressError = true;
      hasError = true;
    }
    if (this.password === "") {
      this.passwordError = true;
      hasError = true;
    }
    if (this.zipcode === "") {
      this.zipcodeError = true;
      hasError = true;
    }
    if (this.address === "") {
      this.addressError = true;
      hasError = true;
    }
    if (this.password !== this.confirmationPassword) {
      this.confirmationPasswordError =
        "※パスワードと確認用パスワードが一致していません";
      hasError = true;
    }
    if (this.confirmationPassword === "") {
      this.confirmationPasswordError = "※確認用パスワードを入力してください";
      hasError = true;
    }
    return hasError;
  }
  /**
   * 郵便番号から住所を取得する.
   */
  async searchAddress(): Promise<void> {
    const url = "https://zipcoda.net/api";
    const response = await axios.get(url, {
      adapter: axiosJsonpAdapter,
      params: {
        zipcode: this.zipcode,
      },
    });
    console.dir("response:" + JSON.stringify(response.data.items[0].address));

    this.address = response.data.items[0].address;
  }
}
</script>

<style scoped>
.register-page {
  width: 600px;
}
.error {
  color: red;
  margin-top: 8px;
}
.addressSearchBtn {
  margin-top: 18px;
}
</style>

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
          <div class="input-field col s6">
            <button
              class="btn btn-large btn-register waves-effect waves-light"
              type="button"
              v-on:click="registerAdmin"
            >
              登録
              <i class="material-icons right">done</i>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import config from '@/const/const';
import axios from 'axios';

/**
 * 管理者登録をする画面.
 */
@Component
export default class RegisterAdmin extends Vue {
  // 姓
  private lastName = '';
  // 名
  private firstName = '';
  // メールアドレス
  private mailAddress = '';
  // パスワード
  private password = '';
  // 姓の未入力エラー
  private lastNameError = false;
  // 名の未入力エラー
  private firstNameError = false;
  // メールアドレスの未入力エラー
  private mailAddressError = false;
  // パスワードの未入力エラー
  private passwordError = false;

  /**
   * 管理者情報を登録する.
   *
   * @remarks
   * 本メソッドは非同期でWebAPIを呼び出し管理者登録をするためasync/await axiosを利用しています。これらを利用する場合は明示的に戻り値にPromiseオブジェクト型を指定する必要があります。
   * @returns Promiseオブジェクト
   */
  async registerAdmin(): Promise<void> {
    this.checkInputValue();
    if (
      this.lastNameError ||
      this.firstNameError ||
      this.mailAddressError ||
      this.passwordError
    ) {
      return;
    }
    // 管理者登録処理
    const response = await axios.post(`${config.EMP_WEBAPI_URL}/insert`, {
      name: this.lastName + ' ' + this.firstName,
      mailAddress: this.mailAddress,
      password: this.password,
    });
    console.dir('response:' + JSON.stringify(response));

    this.$router.push("/loginAdmin");
  }
  
  /**
   * 入力値をチェックする.
   */
  checkInputValue(): void {
    this.lastNameError = false;
    this.firstNameError = false;
    this.mailAddressError = false;
    this.passwordError = false;

    if (this.lastName === '') {
      this.lastNameError = true;
    }
    if (this.firstName === '') {
      this.firstNameError = true;
    }
    if (this.mailAddress === '') {
      this.mailAddressError = true;
    }
    if (this.password === '') {
      this.passwordError = true;
    }
  }
}
</script>

<style scoped>
.register-page {
  width: 600px;
}
.error {
  color: red;
}
</style>

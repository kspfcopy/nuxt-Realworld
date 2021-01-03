
// 登录之后不能访问页面
export default function ({ store, redirect }) {
    if (store.state.user) {
      return redirect('/')
    }
}
  
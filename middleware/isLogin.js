
// 验证是否需要登录
export default function ({ store, redirect }) {
    if (!store.state.user) {
      return redirect('/login')
    }
  }
  
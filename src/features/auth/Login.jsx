import MainLayout from '../../layouts/MainLayout.jsx';

export default function LoginPage() {
  return (
    <MainLayout title="Login">
      <div class="flex min-h-screen items-center justify-center bg-base-200 p-4">
        <div class="card w-full max-w-sm shadow-xl bg-base-100">
          <div class="card-body">
            <h2 class="card-title justify-center text-2xl font-bold mb-4">Login</h2>
            <form action="/auth/login" method="post" class="space-y-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Email</span>
                </label>
                <input type="email" placeholder="email@example.com" class="input input-bordered" required />
              </div>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Password</span>
                </label>
                <input type="password" placeholder="••••••••" class="input input-bordered" required />
                <label class="label">
                  <a href="#" class="label-text-alt link link-hover">Forgot password?</a>
                </label>
              </div>
              <div class="form-control mt-6">
                <button class="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

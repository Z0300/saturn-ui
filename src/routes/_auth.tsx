import { api } from '#/lib/axios';
import { useAuthStore } from '#/store/authStore';
import { isTokenExpired } from '#/utils/jwt';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  ssr: false,
  beforeLoad: async () => {
    const { accessToken, setAuth, clearAuth } = useAuthStore.getState();

    if (accessToken && !isTokenExpired(accessToken)) {
      return;
    }

    try {
      const { data } = await api.post("/v1/auth/refresh");
      setAuth(data.data);
    } catch (e) {
      clearAuth();
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex w-full justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}

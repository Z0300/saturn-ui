import { api } from "#/lib/axios";
import type { Role, SingleResponse } from "#/types";

export async function getRole(roleId: number) {
  const response = await api
    .get<SingleResponse<Role>>(`/v1/roles/${roleId}`)
    .then((r) => r.data.data);

  return response;
}

export interface PostLoginRequest {
  username: string;
  password: string;
}

const BASE = "/api";

export async function postLogin(params: PostLoginRequest): Promise<void> {
  const response = await window.fetch(`${BASE}/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(params),
  });
  if (response.status !== 200) {
    throw response;
  }
}

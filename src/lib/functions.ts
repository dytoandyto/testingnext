export const NEON_FUNCTION_HELLO_BASE_URL =
  process.env.NEON_FUNCTION_HELLO_BASE_URL ||
  "https://br-still-tree-b4v7br1j-hello.compute.c-6.us-east-2.aws.neon.tech";

export async function invokeHelloFunction(): Promise<{ message: string; status: number }> {
  const url = NEON_FUNCTION_HELLO_BASE_URL;
  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Neon Function invocation failed: HTTP ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  return {
    message: text,
    status: res.status,
  };
}

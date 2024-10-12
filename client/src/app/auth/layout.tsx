import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { useRouter } from "next/router";
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const token = cookies().get("token")?.value;

  if (token) {
    router.push("/dashboard");
  }

  return <div>{children}</div>;
}

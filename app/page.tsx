import { redirect } from "next/navigation"

export default function RootPage() {
  // Always redirect to login; middleware will forward authenticated users to /dashboard
  redirect("/login")
}

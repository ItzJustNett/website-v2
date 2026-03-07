import { ReactNode } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"

export default function AuthenticatedPageLayout({ children }: { children: ReactNode }) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}

import { Link } from "@/i18n/routing";

export default function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>
        Page not found
      </p>
      <Link href="/" className="btn-primary">
        Go home
      </Link>
    </div>
  );
}

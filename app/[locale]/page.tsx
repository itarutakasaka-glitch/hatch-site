import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  tools,
  getFeaturedTools,
  type ToolMeta,
} from "@/lib/tools-registry";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const featured = getFeaturedTools();

  const getName = (tool: ToolMeta) =>
    tool.names[locale] || tool.names.en || tool.slug;
  const getTagline = (tool: ToolMeta) =>
    tool.taglines?.[locale] || tool.taglines?.en || "";
  const getDesc = (tool: ToolMeta) =>
    tool.descriptions[locale] || tool.descriptions.en || "";

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="hero-bg">
        <div className="flex justify-center mb-4">
          <span className="tanuki-icon" style={{ width: 64, height: 64, fontSize: 32 }}>
            B
          </span>
        </div>
        <h1
          className="text-4xl sm:text-6xl font-bold mb-4 max-w-3xl mx-auto"
          style={{ color: "var(--color-text)" }}
        >
          {t("home.hero_title")}
        </h1>
        <p
          className="text-lg sm:text-xl max-w-2xl mx-auto"
          style={{ color: "var(--color-text-muted)" }}
        >
          {t("home.hero_subtitle")}
        </p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <span className="pill">100% Free</span>
          <span className="pill">No Signup</span>
          <span className="pill">8 Languages</span>
        </div>
      </section>

      {/* Featured / Popular tools */}
      {featured.length > 0 && (
        <section>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-2 text-center"
            style={{ color: "var(--color-text)" }}
          >
            {t("home.section_popular")}
          </h2>
          <p
            className="text-center mb-8"
            style={{ color: "var(--color-text-muted)" }}
          >
            {tools.length} {tools.length === 1 ? "tool" : "tools"} and growing
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                name={getName(tool)}
                tagline={getTagline(tool)}
                desc={getDesc(tool)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ToolCard({
  tool,
  name,
  tagline,
  desc,
}: {
  tool: ToolMeta;
  name: string;
  tagline: string;
  desc: string;
}) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="tool-card"
      style={{ ["--accent" as string]: tool.accentColor }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{
            background: `${tool.accentColor}15`,
            border: `2px solid ${tool.accentColor}30`,
          }}
        >
          {tool.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold leading-tight">{name}</h3>
          {tagline && (
            <p
              className="text-sm mt-1"
              style={{ color: tool.accentColor }}
            >
              {tagline}
            </p>
          )}
        </div>
      </div>
      <p
        className="text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        {desc.length > 100 ? desc.substring(0, 100) + "..." : desc}
      </p>
    </Link>
  );
}

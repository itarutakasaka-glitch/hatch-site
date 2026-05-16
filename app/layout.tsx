// このlayoutはroutingの都合で必要だが、実際の表示は [locale]/layout.tsx が担当する
// notFound時もここを通るため、最小構成にする

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

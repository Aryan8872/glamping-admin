export function PageHeading({
  heading,
  subheading,
}: {
  heading: string;
  subheading?: string;
}) {
  return (
    <p className="flex flex-col gap-1">
      <span className="text-2xl font-semibold">{heading}</span>
      {subheading && (
        <span className="text-sm text-gray-500">{subheading}</span>
      )}
    </p>
  );
}

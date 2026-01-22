
export function PageHeading({
  heading,
  subheading,
}: {
  heading: string;
  subheading?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
  
      <p className="flex flex-col gap-1">
        <span className="font-montserrat text-2xl font-semibold">{heading}</span>
        {subheading && (
          <span className="text-sm font-inter text-gray-500">{subheading}</span>
        )}
      </p>
    </div>
  );
}

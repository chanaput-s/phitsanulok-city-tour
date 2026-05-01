interface EventCardProps {
  title: string;
  date: string;
  description: string;
  imgUrl: string;
}

export function EventCard({ title, date, description, imgUrl }: EventCardProps) {
  return (
    <div className="flex bg-white rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow overflow-hidden group cursor-pointer h-32">
      {/* Left Thumbnail */}
      <div className="w-32 h-32 shrink-0 overflow-hidden relative bg-neutral-100">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${imgUrl})` }}
        ></div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col justify-center p-4 flex-grow overflow-hidden">
        <h3 className="font-bold text-neutral-800 text-lg leading-tight mb-1  truncate">
          {title}
        </h3>
        <span className="text-xs font-medium text-neutral-500 mb-2 block">
          {date}
        </span>
        <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}

"use client";

const SIZE_CLASS = {
  md: "max-w-md",
  lg: "max-w-3xl",
};

export default function Modal({
  title,
  onClose,
  children,
  size = "md",
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: keyof typeof SIZE_CLASS;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in print:static print:block print:bg-transparent print:p-0 print:backdrop-blur-none"
      onClick={onClose}
    >
      <div
        className={`flex w-full ${SIZE_CLASS[size]} max-h-[85vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-pop-in print:max-h-none print:w-full print:max-w-full print:rounded-none print:shadow-none`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between rounded-t-2xl bg-linear-to-r from-dark-primary via-primary to-rose-600 px-5 py-4 print:hidden">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-full px-2 text-xl leading-none text-white/80 transition-transform duration-200 hover:scale-125 hover:text-white"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto p-5 print:overflow-visible">{children}</div>
      </div>
    </div>
  );
}

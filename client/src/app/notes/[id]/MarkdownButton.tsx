export default function MarkdownButton({
  onClick,
  children,
  role,
}: Readonly<{
  onClick: () => void;
  children: React.ReactNode;
  role: "primary" | "secondary";
}>) {
  const primaryClass =
    "hover:shadow-lg hover:shadow-blue-500/50 text-blue-500 font-medium rounded px-2 py-2 text-center ";
  const secondaryClass =
    "hover:shadow-lg hover:shadow-red-500/50 text-red-500 bg-red-100 font-medium rounded-lg text-sm px-2 py-2 text-center";

  return (
    <button
      onClick={onClick}
      className="text-[#cccccc] border-[1px] border-gray-200/10 hover:text-emerald-100 text-sm bg-[#101010] hover:text-emerald-100 rounded font-medium p-[7px] flex flex-row justify-around items-center min-w-[100px] h-[48px]"
    >
      {children}
    </button>
  );
}

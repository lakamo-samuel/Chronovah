interface Props{
    onClick: (() => void) |((e: React.FormEvent) => Promise<void>),
}

function SaveBtn({onClick}: Props) {
  return (
    <button
      onClick={onClick}
      type="submit"
      className="flex items-center gap-2 place-self-end dark:disabled:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg bg-blue-600 transition"
    >
      Save
    </button>
  );
}

export default SaveBtn;
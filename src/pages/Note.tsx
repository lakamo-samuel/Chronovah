import type { FC } from "react";
import Notes from "../features/Note/NoteList";
import UpgradeNudge from "../components/UpgradeNudge";

const Note: FC = () => {
  return (
    <div className="pb-24">
      <Notes />
      <UpgradeNudge />
    </div>
  );
};

export default Note;

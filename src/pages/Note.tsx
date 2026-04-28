import type { FC } from "react";
import Notes from "../features/Note/NoteList";
import UpgradeNudge from "../components/UpgradeNudge";

const Note: FC = () => {
  return (
    <div style={{ paddingBottom: '100px' }}>
      <Notes />
      <UpgradeNudge />
    </div>
  );
};
export default Note;

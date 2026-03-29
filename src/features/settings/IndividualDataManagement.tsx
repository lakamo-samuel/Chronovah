import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../database/db";
import { useAuth } from "../../hooks/useAuth";
import IndividualData from "./IndividualData";

const dbMap = {
  people: db.people,
  places: db.places,
  notes: db.notes,
  journals: db.journal,
} as const;

function IndividualDataManagement() {
  const { user } = useAuth();

  const people = useLiveQuery(() => {
    if (!user?.id) return [];
    return db.people.where("userId").equals(user.id).toArray();
  }, [user?.id]) || [];

  const places = useLiveQuery(() => {
    if (!user?.id) return [];
    return db.places.where("userId").equals(user.id).toArray();
  }, [user?.id]) || [];

  const notes = useLiveQuery(() => {
    if (!user?.id) return [];
    return db.notes.where("userId").equals(user.id).toArray();
  }, [user?.id]) || [];

  const journals = useLiveQuery(() => {
    if (!user?.id) return [];
    return db.journal.where("userId").equals(user.id).toArray();
  }, [user?.id]) || [];
 
  return (
    <>
      {[
        { name: "People", data: people },
        { name: "Places", data: places },
        { name: "Notes", data: notes },
        { name: "Journals", data: journals },
      ].map(({ name, data }) => (
          <IndividualData key={name} name={name} data={data} dbMap={dbMap}/>
      ))}
    </>
  );
}

export default IndividualDataManagement;

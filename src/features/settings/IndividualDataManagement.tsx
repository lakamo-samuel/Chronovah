import { useLiveQuery } from "dexie-react-hooks";
import { db as peopleDB } from "../../Database/peopleDB";
import { db as placeDB } from "../../Database/placesDB";
import { db as journalDB } from "../../Database/journalDB";
import { db as noteDB } from "../../Database/db";
import IndividualData from "./IndividualData";
const dbMap = {
  people: peopleDB.people,
  places: placeDB.places,
  notes: noteDB.notes,
  journals: journalDB.journal,
} as const;
function IndividualDataManagement() {
  const people = useLiveQuery(() => peopleDB.people.toArray(), []) || [];
  const places = useLiveQuery(() => placeDB.places?.toArray(), []) || [];
  const notes = useLiveQuery(() => noteDB.notes?.toArray(), []) || [];
  const journals = useLiveQuery(() => journalDB.journal?.toArray(), []) || [];
 
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

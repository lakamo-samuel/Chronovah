import { useLiveQuery } from "dexie-react-hooks";
import { db, type Place } from "../Database/placesDB";
import { useState } from "react";

function Places() {
  const places = useLiveQuery(() => db.places.toArray(), []) || [];
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("City");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPlace: Omit<Place, "id"> = {
      name,
      country,
      location,
      type,
      notes,
      image,
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
      await db.places.update(editingId, newPlace);
      setEditingId(null);
    } else {
      await db.places.add(newPlace);
    }

    setName("");
    setCountry("");
    setLocation("");
    setType("City");
    setNotes("");
    setImage("");
  };

  const handleEdit = (place: Place) => {
    setEditingId(Number(place.id));
    setName(place.name);
    setCountry(place.country);
    setLocation(place.location);
    setType(place.type);
    setNotes(place.notes);
    setImage(place.image);
  };

  const handleDelete = async (id: number) => {
    await db.places.delete(id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 max-w-4xl my-20 mx-auto space-y-6">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow space-y-3"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Place" : "Add New Place"}
        </h2>

        <input
          type="text"
          placeholder="Place name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-2 outline-none focus:border-blue-500"
          required
        />

        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-2 outline-none focus:border-blue-500"
          required
        />

        <input
          type="text"
          placeholder="Location (City, Street, etc.)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-2 outline-none focus:border-blue-500"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-2 outline-none focus:border-blue-500"
        >
          <option value="City">City</option>
          <option value="Village">Village</option>
          <option value="Landmark">Landmark</option>
          <option value="Restaurant">Restaurant</option>
          <option value="School">School</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          placeholder="Notes about this place"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-2 outline-none focus:border-blue-500"
        />

        <div>
          <label className="block text-sm mb-1">Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-sm"
          />
          {image && (
            <img
              src={image}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-xl border border-gray-300 dark:border-neutral-700"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition"
        >
          {editingId ? "Save Changes" : "Add Place"}
        </button>
      </form>

      {/* List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((place) => (
          <div
            key={place.id}
            className="p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow space-y-2"
          >
            {place.image && (
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-40 object-cover rounded-xl"
              />
            )}
            <h3 className="text-lg font-semibold">{place.name}</h3>
            <p className="text-sm text-neutral-500">{place.country}</p>
            {place.location && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                📍 {place.location}
              </p>
            )}
            <p className="text-sm">Type: {place.type}</p>
            {place.notes && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {place.notes}
              </p>
            )}
            <div className="flex justify-between text-sm pt-1">
              <span
                onClick={() => handleEdit(place)}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Edit
              </span>
              <span
                onClick={() => handleDelete(Number(place.id))}
                className="text-red-600 cursor-pointer hover:underline"
              >
                Delete
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Places;

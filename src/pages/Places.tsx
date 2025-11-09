import { useState } from "react";
import { db } from "../Database/placesDB";
import { useLiveQuery } from "dexie-react-hooks";
import { nanoid } from "nanoid";

function Places() {
  const places = useLiveQuery(() => db.places.toArray(), []) || [];
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addPlace = async () => {
    if (!name.trim() || !location.trim()) return;

    await db.places.add({
      id: Number(nanoid()),
      name,
      location,
      description,
      category,
      image: image || "",
      createdAt: new Date().toISOString(),
    });

    setName("");
    setLocation("");
    setDescription("");
    setCategory("");
    setImage(null);
  };

  return (
    <div className="p-4 sm:p-6 mt-20 pb-28">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Places
      </h2>

      {/* Form */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Place name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded-md bg-gray-100 dark:bg-[#1E293B] text-gray-800 dark:text-gray-100"
        />
        <input
          type="text"
          placeholder="Location / Address"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 rounded-md bg-gray-100 dark:bg-[#1E293B] text-gray-800 dark:text-gray-100"
        />
        <input
          type="text"
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 rounded-md bg-gray-100 dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 sm:col-span-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="p-2 rounded-md bg-gray-100 dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 sm:col-span-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="sm:col-span-2 text-gray-800 dark:text-gray-100"
        />
        <button
          onClick={addPlace}
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 sm:col-span-2"
        >
          Add Place
        </button>
      </div>

      {/* Places grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((place) => (
          <div
            key={place.id}
            className="bg-white dark:bg-[#0B1120] p-4 rounded-lg shadow hover:shadow-md transition"
          >
            {place.image && (
              <img
                src={place.image}
                alt={place.name}
                onClick={() => setPreview(place.image!)}
                className="w-full h-40 object-cover rounded-md mb-2 cursor-pointer"
              />
            )}
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              {place.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              📍 {place.location}
            </p>
            {place.category && (
              <span className="text-xs text-blue-500 font-medium">
                #{place.category}
              </span>
            )}
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3 break-words">
              {place.description || "No description..."}
            </p>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            alt="Preview"
            className="max-w-[90%] max-h-[80%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}

export default Places;

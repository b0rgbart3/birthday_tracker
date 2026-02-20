import { useState, useEffect, useCallback } from "react";
import { BirthdayForm } from "./components/BirthdayForm";
import { BirthdayList } from "./components/BirthdayList";
import { Cake } from "lucide-react";

interface Birthday {
  _id: string;
  name: string;
  date: string;
}

function App() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: "name" | "date";
    direction: "asc" | "desc";
  } | null>(null);

  const base_URL = "https://birthdaytracker.bartdorityportfolio.online/api";

  const fetchBirthdays = useCallback(async () => {
    try {
      const response = await fetch(`${base_URL}/birthdays`);
      if (response.ok) {
        const data = await response.json();
        setBirthdays(data);
        setError(null);
      } else {
        setError("Failed to fetch data from server.");
      }
    } catch (error) {
      console.error("Error fetching birthdays:", error);
      setError(
        "Cannot connect to the backend server. Please ensure it is running and MongoDB is connected.",
      );
    }
  }, []);

  useEffect(() => {
    fetchBirthdays();
  }, [fetchBirthdays]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${base_URL}${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchBirthdays();
      }
    } catch (error) {
      console.error("Error deleting birthday:", error);
    }
  };

  const handleSort = (key: "name" | "date") => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...birthdays].sort((a, b) => {
      if (key === "name") {
        return direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return direction === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
    setBirthdays(sortedData);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-full mb-4 border border-blue-500/20">
            <Cake className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl mb-2">
            Birthday Tracker
          </h1>
          <p className="text-lg text-slate-400">
            Never miss a special day again.
          </p>
        </header>

        <main className="space-y-12">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          <section>
            <BirthdayForm onAdd={fetchBirthdays} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Tracked Birthdays
              </h2>
              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/20">
                {birthdays.length} Total
              </span>
            </div>
            <BirthdayList
              birthdays={birthdays}
              onDelete={handleDelete}
              onSort={handleSort}
            />
          </section>
        </main>

        <footer className="mt-20 text-center text-slate-600 text-sm">
          <p>Managed by BirthdayTracker System &bull; MongoDB Backend</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

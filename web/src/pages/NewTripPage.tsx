import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { daysUntilStart, trackEvent, tripLengthDays } from "../analytics/pendo";
import { tripsApi, type NewTrip } from "../api/trips";
import { TripForm } from "../components/TripForm";

/** Plans a new trip, then goes back to the trip list. */
export function NewTripPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const createTrip = async (trip: NewTrip) => {
    try {
      setError(null);
      const created = await tripsApi.create(trip);
      // The API created the trip; fired before going back to the trip list.
      trackEvent("trip_created", {
        tripId: created.id,
        destination: trip.destination,
        travelers: trip.travelers,
        tripLengthDays: tripLengthDays(trip.startDate, trip.endDate),
        daysUntilStart: daysUntilStart(trip.startDate),
        startDate: trip.startDate,
      });
      navigate("/trips");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <>
      <TripForm heading="Plan a trip" submitLabel="Add trip" onSubmit={createTrip} />
      {error && <p className="error">{error}</p>}
    </>
  );
}

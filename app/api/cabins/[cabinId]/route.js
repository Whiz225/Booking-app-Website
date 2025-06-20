import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

export function GET(request, { params }) {
  const { cabinId } = params;
  try {
    // const [cabin, bookedDates] = Promise.all([
    //   getCabin(cabinId),
    //   getBookedDatesByCabinId(cabinId),
    // ]);
    const cabin = getCabin(cabinId)

    return Response.json({ cabin, bookedDates: 'booking' });
  } catch (error) {
    return Response.json({ message: "Cabin not found" });
  }
}

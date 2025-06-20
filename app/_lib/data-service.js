import { eachDayOfInterval } from "date-fns";
import axios from "./axios";
import { notFound } from "next/navigation";
/////////////
// GET

export async function getCabin(id) {
  const res = await axios.get(`/cabins/web/${id}`);
  if (res.data?.status !== "success") {
    // console.log(res.data.response.message);
    console.log("cabinId can not be loaded");
    notFound();
  }
  // if(!res.data) throw new Error('No cabin found with Id:)')
  return res.data.data.data;
}

export async function getCabinPrice(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function () {
  const res = await axios.get("/cabins/web");

  if (res.data.status !== "success") {
    // console.log(res.response.data.message);
    throw new Error("cabins can not be loaded");
  }
  // if(!res.data) throw new Error('No cabin found with Id:)')
  return res.data.data.data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email) {
  const res = await axios.post("/guests/web", { email });
  if (res.data.status !== "success") {
    throw new Error("Guest could not be loaded");
  }
  return res.data.data.data;
}

export async function getBooking(id) {
  const res = await axios.get(`/bookings/web/${id}`);
  if (res.data.status !== "success") {
    console.log("No booking found with the ID:)");
    notFound();
  }
  return res.data.data.data;
}

export async function getBookings(guestId) {
  const res = await axios.get(`/bookings/guestWeb/${guestId}`);

  if (res.data.status !== "success") throw new Error("No bookings found");

  return res.data.data.data;
}

export async function getBookedDatesByCabinId(cabinId) {
  const res = await axios.get(`/bookings/cabinWeb`);
  // const res = await axios.get(`/bookings/cabinWeb/${cabinId}`);

  if (res.data.status !== "success") throw new Error("No bookings found");

  const bookedDatesByCabinId = res.data.data.plan.filter(
    (el) => el.cabinId !== cabinId
  );
  // Converting to actual dates to be displayed in the date picker
  const bookedDates = bookedDatesByCabinId
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const res = await axios.get("/settings/web");
  if (res.data.status !== "success") throw new Error("Settings not found");

  return res.data.data.data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

// export async function createGuest(newGuest) {
//   const { data, error } = await supabase.from("guests").insert([newGuest]);

//   if (error) {
//     console.error(error);
//     throw new Error("Guest could not be created");
//   }

//   return data;
// }

export async function createGuest(obj) {
  console.log(obj);
  const res = await axios.post("/guests/newGuest", obj);

  if (res.data.status !== "success") {
    console.log("Guest could not be loaded");
  }
  return res.data.data.data;
}

export async function createBooking(newBooking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id, updatedFields) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id, updatedFields) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

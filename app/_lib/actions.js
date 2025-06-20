"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import axios from "./axios";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("Please login to continue");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");
  const updateData = { nationalID, countryFlag, nationality };

  const res = await axios.patch(`guests/${session.user.guestId}`, updateData);
  if (res.data.status !== "success")
    throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("Please login to continue");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking._id);
  if (!guestBookingIds.includes(bookingId))
    throw Error("You are not allow to delete this booking");

  const res = await axios.delete(`/bookings/web/${bookingId}`);
  if (res.status !== 204) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  const session = await auth();
  if (!session) throw new Error("Please login to continue");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking._id);

  const bookingId = formData.get("bookingId");
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allow to update this booking");

  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };
  const res = await axios.patch(`/bookings/web/${bookingId}`, updateData);
  if (res.data.status !== "success")
    throw new Error("Booking could not be updated");

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  redirect("/account/reservations");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("Please login to continue");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    totalPrice: bookingData.cabinPrice,
  };

  const res = await axios.post(`/bookings/web`, newBooking);
  if (res.data.status !== "success")
    throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut("google", { redirectTo: "/" });
}

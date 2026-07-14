'use server';

import Booking from '@/database/booking.model';
import connectDB from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string; }) => {
    try {
        await connectDB();

        await Booking.create({ eventId, email });

        // Revalidate the event detail page so booking count updates
        revalidatePath(`/events/${slug}`);

        return { success: true };
    } catch (e: unknown) {
        console.error('create booking failed', e);

        // Check for duplicate booking (unique index violation)
        if (e && typeof e === 'object' && 'code' in e && (e as { code: number }).code === 11000) {
            return { success: false, error: 'You have already booked this event with this email.' };
        }

        return { success: false, error: 'Booking failed. Please try again.' };
    }
}

export const getBookingCount = async (eventId: string): Promise<number> => {
    try {
        await connectDB();
        return await Booking.countDocuments({ eventId });
    } catch (e) {
        console.error('get booking count failed', e);
        return 0;
    }
}
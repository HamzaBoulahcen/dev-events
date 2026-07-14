'use server';

import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });

        if (!event) return [];

        const similarEvents = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags }
        }).lean();

        // Serialize MongoDB documents to plain objects for React
        return similarEvents.map((e) => ({
            ...e,
            _id: e._id.toString(),
            createdAt: e.createdAt?.toISOString?.() ?? e.createdAt,
            updatedAt: e.updatedAt?.toISOString?.() ?? e.updatedAt,
        }));
    } catch {
        return [];
    }
}
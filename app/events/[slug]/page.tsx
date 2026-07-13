import { notFound } from 'next/navigation';
import React from 'react';
import dbConnect from "@/lib/mongodb";
import Event from '@/database/event.model';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const EventDetailsPage = async ({ params }: PageProps) => {
    const { slug } = await params;
    
    // Connect to database directly (Next.js recommended server-component pattern)
    await dbConnect();
    
    // Fetch event by slug
    const event = await Event.findOne({ slug: slug.toLowerCase().trim() }).lean();
    
    if (!event) {
        return notFound();
    }

    return (
        <section id="event">
            <div className="header">
                <span className="pill uppercase tracking-wider">{event.mode}</span>
                <h1 className="text-center sm:text-left mt-2">{event.title}</h1>
                <p className="subheading">{event.overview}</p>
            </div>
            
            <div className="details">
                <div className="content">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={event.image} 
                        alt={event.title} 
                        className="banner"
                    />
                    
                    <div className="description mt-6">
                        <h2 className="mb-3">About the Event</h2>
                        <p className="leading-relaxed">{event.description}</p>
                    </div>

                    {event.agenda && event.agenda.length > 0 && (
                        <div className="agenda mt-8">
                            <h2 className="mb-4">Agenda</h2>
                            <ul className="space-y-3">
                                {event.agenda.map((item: string, idx: number) => (
                                    <li key={idx} className="list-disc ml-5">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="booking">
                    <div className="signup-card">
                        <h2 className="text-xl font-bold mb-4">Event Information</h2>
                        
                        <div className="flex-col-gap-2 text-sm text-light-200 space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">Date:</span> {event.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">Time:</span> {event.time}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">Venue:</span> {event.venue}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">Location:</span> {event.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">Audience:</span> {event.audience}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">Organizer:</span> {event.organizer}
                            </div>
                        </div>

                        {event.tags && event.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {event.tags.map((tag: string, idx: number) => (
                                    <span key={idx} className="pill bg-dark-200">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <hr className="border-gray-700 my-4" />

                        <div id="book-event">
                            <h3 className="text-lg font-bold mb-2">Book Your Spot</h3>
                            <form>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs text-light-200">Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="John Doe" 
                                        required 
                                        className="text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 mt-4">
                                    <label className="text-xs text-light-200">Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="john@example.com" 
                                        required 
                                        className="text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="transition-colors duration-200"
                                >
                                    Register Now
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventDetailsPage;
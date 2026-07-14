import EventCard from "@/components/EventCard";
import {IEvent} from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventsPage = async () => {
    const response = await fetch(`${BASE_URL}/api/events`, {
        next: { revalidate: 60 }
    });
    const { events } = await response.json();

    return (
        <section>
            <h1>All Events</h1>
            <p className="mt-5 mb-10">Discover hackathons, meetups, and conferences happening around the world.</p>

            <div className="events">
                {events && events.length > 0 ? (
                    events.map((event: IEvent) => (
                        <div key={event.title} className="list-none">
                            <EventCard {...event} />
                        </div>
                    ))
                ) : (
                    <p>No events found.</p>
                )}
            </div>
        </section>
    )
}

export default EventsPage;
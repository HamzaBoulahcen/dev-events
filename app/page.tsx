import EventCard from '../components/EventCard';
import ExploreBtn from '@/components/ExploreBtn';
import React from 'react'
import { events } from '@/lib/constants';

const page = () => {
  return (
    <section>
        <h1 className="text-center">The hub for every dev <br /> event in the world</h1>
        <p className="text-center mt-5  ">Hackthons , Meetups, Conferences</p>
        <ExploreBtn />
        <div  className='mt-20 space-y-7'>
            <h3>Featured Events</h3>
            <ul className='events'>
                {events.map((event, index) => (
                    <EventCard 
                      key={index} 
                      title={event.title}
                      image={event.image}
                      slug={event.slug}
                      location={event.location}
                      date={event.date}
                      time={event.time}
                    /> 
                ))}
            </ul>
        </div>
    </section> 
  )
}

export default page ;
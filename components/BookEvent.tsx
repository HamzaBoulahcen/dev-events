'use client';

import {useState} from "react";
import {createBooking} from "@/lib/actions/booking.actions";

const BookEvent = ({ eventId, slug }: { eventId: string, slug: string;}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await createBooking({ eventId, slug, email });

            if (result.success) {
                setSubmitted(true);
            } else {
                setError(result.error || 'Booking failed. Please try again.');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">🎉 Thank you for signing up! Check your email for confirmation.</p>
            ): (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    {error && <p className="text-sm" style={{ color: '#ef4444', marginTop: '0.5rem' }}>{error}</p>}

                    <button type="submit" className="button-submit" disabled={loading}>
                        {loading ? 'Booking...' : 'Submit'}
                    </button>
                </form>
            )}
        </div>
    )
}
export default BookEvent;
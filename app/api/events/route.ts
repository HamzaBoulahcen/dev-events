import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from '@/database/event.model';
import { v2 as cloudinary } from 'cloudinary'; // 1. Added missing Cloudinary import




export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const contentType = req.headers.get("content-type") || "";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let eventData: any = {};
        let file: File | null = null; // Scope file here so we can grab it from form-data

        // 1. Support both JSON and multipart Form Data content types
        if (contentType.includes("application/json")) {
            eventData = await req.json();
        } else if (
            contentType.includes("multipart/form-data") || 
            contentType.includes("application/x-www-form-urlencoded")
        ) {
            const formData = await req.formData();
            
            // Extract the image file safely inside this block
            file = formData.get('image') as File;

            // Correctly parse arrays from form-data (avoiding Object.fromEntries overwrites)
            formData.forEach((value, key) => {
                // Skip the image key so it doesn't get converted into a string in eventData
                if (key === 'image') return; 

                if (key === "agenda" || key === "tags") {
                    if (!eventData[key]) {
                        eventData[key] = [];
                    }
                    eventData[key].push(value.toString());
                } else {
                    eventData[key] = value.toString();
                }
            });
        } else {
            return NextResponse.json(
                { message: 'Unsupported content-type' }, 
                { status: 400 }
            );
        }

        // 2. Normalize "mode" to match the database enum values
        if (eventData.mode) {
            const modeLower = eventData.mode.toLowerCase();
            if (modeLower.includes("hybrid")) {
                eventData.mode = "hybrid";
            } else if (modeLower.includes("online")) {
                eventData.mode = "online";
            } else if (modeLower.includes("offline")) {
                eventData.mode = "offline";
            }
        }

        // 3. Handle Cloudinary Upload / Image specification
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            try {
                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                        if (error) return reject(error);
                        resolve(results);
                    }).end(buffer);
                });
                eventData.image = (uploadResult as { secure_url: string }).secure_url;
            } catch (uploadError: any) {
                console.error("Cloudinary Upload Error:", uploadError);
                
                // Allow fallback in development if Cloudinary credentials fail
                if (process.env.NODE_ENV === 'development') {
                    console.warn("⚠️ DEVELOPMENT FALLBACK: Cloudinary upload failed. Using a placeholder image instead.");
                    eventData.image = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800";
                } else {
                    const errorMessage = uploadError && typeof uploadError === 'object' && 'message' in uploadError 
                        ? uploadError.message 
                        : JSON.stringify(uploadError);
                    return NextResponse.json(
                        { message: `Cloudinary Upload Failed: ${errorMessage}. Please check your Cloudinary credentials.` }, 
                        { status: 502 }
                    );
                }
            }
        } else if (eventData.image) {
            // If JSON or Form data sends a direct image URL, use it directly
            console.log("Using direct image URL:", eventData.image);
        } else {
            return NextResponse.json({ message: 'Image file (for form-data) or image URL (for JSON) is required' }, { status: 400 });
        }

        // Create a new event in the database
        const CreatedEvent = await Event.create(eventData);

        return NextResponse.json(
            { message: 'Event Created Successfully', event: CreatedEvent }, 
            { status: 201 }
        );

    } catch (e: any) {
        console.error("API Event Creation Error:", e);
        const errMsg = e instanceof Error 
            ? e.message 
            : (e && typeof e === 'object' && 'message' in e ? String(e.message) : String(e));
        return NextResponse.json(
            { message: 'Event Creation Failed', error: errMsg },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await dbConnect();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}
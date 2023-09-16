import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: Request): Promise<NextResponse<unknown>> {
    try {
        const body = JSON.parse(await req.text());

        console.log(body);
        const { doc, pol, lat, lng } = body;

        let docData = [], polData = [];
        if (doc) {
            const res = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=hospital&location=${lat}%2C${lng}&radius=2000&type=restaurant&key=AIzaSyBmy2F0EtGGkSn-yEgVMfsjAQ-q3qZW49w`)
            const data = await res.json();
            docData = data.results;
        }
        if (pol) {
            const res = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=police&location=${lat}%2C${lng}&radius=2000&type=restaurant&key=AIzaSyBmy2F0EtGGkSn-yEgVMfsjAQ-q3qZW49w`)
            const data = await res.json();
            polData = data.results;
        }

        return new NextResponse(JSON.stringify({
            doc: docData,
            pol: polData
        }), { status: 200 });
    }
    catch (error) {
        return new NextResponse(JSON.stringify(error), {
            status: 500,
        });
    }
}
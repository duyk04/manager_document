// app/api/metabase/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SITE_URL = process.env.METABASE_SITE_URL;
const SECRET_KEY = process.env.METABASE_SECRET_KEY;

export async function GET() {
    try {
        const payload = {
            resource: { dashboard: 2 },
            params: {}, 
            exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 phút
        };

        if (!SECRET_KEY) {
            throw new Error('METABASE_SECRET_KEY is not defined');
        }
        const token = jwt.sign(payload, SECRET_KEY);
        const iframeUrl = `${SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`;

        return NextResponse.json({ iframeUrl });
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi tạo token Metabase' }, { status: 500 });
    }
}

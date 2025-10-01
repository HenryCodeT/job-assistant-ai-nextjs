// app/api/generation/letter/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GenerateLetter } from '../../../../application/GenerateLetter';

export async function POST(request: NextRequest) {
    try {
        const { cvId, jobDescription } = await request.json();

        if (!cvId || !jobDescription) {
            return NextResponse.json({ error: 'cvId and jobDescription are required' }, { status: 400 });
        }

        // Call the Application Layer Use Case
        const generateLetterUseCase = new GenerateLetter();
        const coverLetter = await generateLetterUseCase.execute({
            cvId,
            jobDescription
        });

        return NextResponse.json({ coverLetter }, { status: 200 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            error: 'Failed to generate cover letter',
            details: error.message
        }, { status: 500 });
    }
}
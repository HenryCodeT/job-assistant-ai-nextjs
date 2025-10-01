// app/api/cv/upload/route.ts
// Handles file upload or LinkedIn scraping

import { NextRequest, NextResponse } from 'next/server';
import { UploadCV } from '../../../application/UploadCV';

// Disable Next.js Body Parser to handle file streams/buffers
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File | null;
    const linkedinUrl = data.get('linkedinUrl') as string | null;

    if (!file && !linkedinUrl) {
      return NextResponse.json({ error: 'Must provide a file or a LinkedIn URL' }, { status: 400 });
    }
    
    let fileBuffer = Buffer.from([]);
    let filename = '';
    
    if (file) {
        fileBuffer = Buffer.from(await file.arrayBuffer());
        filename = file.name;
    }

    // Call the Application Layer Use Case
    const uploadCVUseCase = new UploadCV(); 
    const cvId = await uploadCVUseCase.execute({ 
        file: fileBuffer, 
        filename, 
        linkedinUrl: linkedinUrl || undefined 
    });

    return NextResponse.json({ 
      message: 'CV processed successfully', 
      cvId 
    }, { status: 200 });
    
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ 
      error: 'Failed to process CV', 
      details: error.message 
    }, { status: 500 });
  }
}
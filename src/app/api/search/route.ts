// app/api/cv/search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { SearchCVs } from '../../../application/SearchCVs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryText = searchParams.get('query');
    const topK = parseInt(searchParams.get('topK') || '5');

    if (!queryText) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    // Call the Application Layer Use Case
    const searchCVsUseCase = new SearchCVs();
    const results = await searchCVsUseCase.execute({ 
        queryText, 
        topK 
    });

    return NextResponse.json(results, { status: 200 });
    
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ 
      error: 'Failed to search CVs', 
      details: error.message 
    }, { status: 500 });
  }
}
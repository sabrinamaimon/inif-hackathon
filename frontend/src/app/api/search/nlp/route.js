import { NextResponse } from 'next/server';
import { parseCommuteQuery } from '../../../../utils/nlpParser';

export async function POST(request) {
  try {
    const { query, fallbackOrigin = 'Mirpur 10', fallbackDest = 'Motijheel' } = await request.json();
    if (!query) {
      return NextResponse.json({ error: 'Missing query string' }, { status: 400 });
    }

    const result = parseCommuteQuery(query, fallbackOrigin, fallbackDest);
    return NextResponse.json(result);
  } catch (error) {
    console.error('NLP route error:', error);
    return NextResponse.json({ error: 'NLP parsing error' }, { status: 500 });
  }
}

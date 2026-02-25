import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, problem, contact } = await request.json();
    
    // API-ключ твоего бота и ID руководителя (Мамы)
    const BOT_TOKEN = '8767362169:AAFJDTWmIBDatLFJtpSqDi8dHqqMJweyDFY';
    const CHAT_ID = '5720865346';

    const text = `🚀 *Новая заявка в OnAyak!*\n\n👤 *Клиент:* ${name}\n❓ *Проблема:* ${problem}\n📱 *Контакт:* ${contact}`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      throw new Error('Telegram API error');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const BOT_TOKEN = '8767362169:AAFJDTWmIBDatLFJtpSqDi8dHqqMJweyDFY';
    const ADMIN_ID = '5623597772'; 

    let text = '';
    let targetChatId = ADMIN_ID;

    if (body.action === 'new_lead') {
      text = `🚀 *Новая заявка (OnAyak)*\n\n👤 *Клиент:* ${body.name}\n❓ *Проблема:* ${body.problem}\n📅 *Время:* ${body.date}\n📝 *Заметка:* ${body.comment || 'Нет'}\n📱 *Контакт:* ${body.contact}`;
      targetChatId = ADMIN_ID; 
    } 
    else if (body.action === 'reschedule') {
      // ИЗМЕНЕН КОММЕРЧЕСКИЙ ТЕКСТ (БЕЗ СЛОВА ВРАЧ)
      text = `⚠️ *Изменение в вашей записи*\n\nЦентр подологии обновил время вашего приема.\n📅 *Новое время:* ${body.newDate}\n\nЕсли это время вам не подходит, пожалуйста, свяжитесь с администратором.`;
      targetChatId = body.client_tg_id || ADMIN_ID;
    }

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) throw new Error('Telegram API error');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
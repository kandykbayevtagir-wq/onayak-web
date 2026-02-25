import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const BOT_TOKEN = '8767362169:AAFJDTWmIBDatLFJtpSqDi8dHqqMJweyDFY';
    const ADMIN_ID = '5623597772'; 

    let text = '';
    // Создаем прямую ссылку на контакт для Telegram
    const contactLink = body.contact.startsWith('@') 
      ? `https://t.me/${body.contact.substring(1)}` 
      : `tg://user?id=${body.client_tg_id}`;

    if (body.action === 'new_lead') {
      text = `🚀 *Новая запись на прием*\n\n👤 *Клиент:* ${body.name}\n❓ *Проблема:* ${body.problem}\n📅 *Время:* ${body.date}\n📱 [Связаться с клиентом](${contactLink})`;
    } else if (body.action === 'new_delivery') {
      text = `📦 *Новый заказ товара*\n\n👤 *Клиент:* ${body.name}\n🛒 *Товар:* ${body.product}\n📱 [Связаться с клиентом](${contactLink})`;
    } else if (body.action === 'reschedule') {
      text = `⚠️ *Изменение в вашей записи*\n\nЦентр подологии обновил время вашего приема.\n📅 *Новое время:* ${body.newDate}`;
    }

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: body.client_tg_id || ADMIN_ID, text: text, parse_mode: 'Markdown' }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
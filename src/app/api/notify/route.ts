import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const BOT_TOKEN = '8767362169:AAFJDTWmIBDatLFJtpSqDi8dHqqMJweyDFY';
    const ADMIN_ID = '5623597772'; 

    let text = '';
    const contactLink = body.contact?.startsWith('@') 
      ? `https://t.me/${body.contact.substring(1)}` 
      : `tg://user?id=${body.client_tg_id}`;

    if (body.action === 'new_lead') {
      text = `🚀 *Новая запись*\n\n👤 *Клиент:* ${body.name}\n❓ *Проблема:* ${body.problem}\n📅 *Время:* ${body.date}\n📝 *Заметка:* ${body.comment || 'Нет'}\n📱 [Связаться](${contactLink})`;
    } else if (body.action === 'new_delivery') {
      text = `📦 *Заказ товара*\n\n👤 *Клиент:* ${body.name}\n🛒 *Товар:* ${body.product}\n📱 [Связаться](${contactLink})`;
    } else if (body.action === 'reschedule') {
      text = `⚠️ *Изменение в записи*\n\nЦентр подологии обновил время вашего приема.\n📅 *Новое время:* ${body.newDate}`;
    } else if (body.action === 'coffee_request') {
      // НОВЫЙ БЛОК: Заказ кофе
      text = `☕ *Сервис в салоне!*\n\nКлиент *${body.name}* ожидает в зоне ресепшена и просит напиток. Пожалуйста, предложите кофе или чай.`;
    }

    // Определяем, кому шлем: если перенос времени — клиенту, иначе — руководителю
    const targetChatId = body.action === 'reschedule' ? (body.client_tg_id || ADMIN_ID) : ADMIN_ID;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: targetChatId, text: text, parse_mode: 'Markdown' }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
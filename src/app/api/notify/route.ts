import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // If Telegram isn't configured yet, just return silently
    if (!botToken || !chatId) {
      return NextResponse.json({ success: true, warning: 'No Telegram bot configured' });
    }

    let messageText = '';

    if (type === 'order') {
      let itemsList = '';
      data.items.forEach((item: any) => {
        itemsList += `- <b>${item.name}</b> (x${item.quantity})\n`;
      });

      messageText = `🚨 <b>新しい注文 | NEW ORDER</b>\n\n` +
                    `👤 <b>Customer:</b> ${data.customerName}\n` +
                    `📞 <b>Phone:</b> ${data.customerPhone}\n` +
                    `💰 <b>Total Price:</b> ${data.totalPrice} DZ\n\n` +
                    `🍣 <b>Items:</b>\n${itemsList}`;
                    
    } else if (type === 'reservation') {
      messageText = `🗓️ <b>新しい予約 | NEW RESERVATION</b>\n\n` +
                    `👤 <b>Name:</b> ${data.name}\n` +
                    `📞 <b>Phone:</b> ${data.phone}\n` +
                    `📅 <b>Date:</b> ${data.date}\n` +
                    `⏰ <b>Time:</b> ${data.time}\n` +
                    `👥 <b>Guests:</b> ${data.guests}\n` +
                    `📝 <b>Notes:</b> ${data.notes || 'None'}`;
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send notification via Telegram', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

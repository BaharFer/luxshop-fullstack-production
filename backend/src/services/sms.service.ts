import { env } from '../config/env';

const SMS_IR_URL = 'https://api.sms.ir/v1/send/bulk';

function maskPhone(phone: string) {
  if (!phone) {
    return 'empty';
  }

  if (phone.length <= 4) {
    return '****';
  }

  return `${phone.slice(0, 4)}****${phone.slice(-2)}`;
}

export async function sendSms(
  receptor: string,
  message: string,
) {
  if (
    !env.smsIrApiKey ||
    !env.smsIrLineNumber ||
    !receptor
  ) {
    console.log('⚠️ SMS SKIPPED:', {
      apiKeyConfigured: Boolean(env.smsIrApiKey),
      lineNumberConfigured: Boolean(
        env.smsIrLineNumber,
      ),
      receptorConfigured: Boolean(receptor),
    });

    return {
      skipped: true,
    };
  }

  console.log('📱 SMS REQUEST:', {
    receptor: maskPhone(receptor),
    lineNumber: env.smsIrLineNumber,
    messageLength: message.length,
  });

  try {
    const response = await fetch(SMS_IR_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-KEY': env.smsIrApiKey,
      },
      body: JSON.stringify({
        lineNumber: env.smsIrLineNumber,
        MessageText: message,
        Mobiles: [receptor],
        SendDateTime: null,
      }),
    });

    const data = await response
      .json()
      .catch(() => ({}));

    console.log('📨 SMS.IR RESPONSE:', {
      httpStatus: response.status,
      ok: response.ok,
      data,
    });

    if (!response.ok) {
      throw new Error(
        `SMS.ir HTTP ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    console.error(
      '❌ SMS.ir provider error:',
      error,
    );

    return {
      skipped: false,
      failed: true,
    };
  }
}

export async function notifyStore(
  message: string,
) {
  if (
    !env.smsOrderNotifications ||
    !env.storeNotificationPhone
  ) {
    console.log('⚠️ STORE SMS SKIPPED:', {
      smsEnabled: env.smsOrderNotifications,
      recipientConfigured:
        Boolean(env.storeNotificationPhone),
    });

    return {
      skipped: true,
    };
  }

  console.log('📤 STORE SMS NOTIFICATION:', {
    recipient: maskPhone(
      env.storeNotificationPhone,
    ),
  });

  return sendSms(
    env.storeNotificationPhone,
    message,
  );
}

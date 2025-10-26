// SNS (Simple Notification Service) Pricing Data

// Request pricing (per million)
export const SNS_REQUEST_PRICING = {
  publishAPI: 0.50, // per million requests
  standard: 0.50, // per million notifications (standard)
  sms: 0.00645, // per SMS (US)
  mobile: 0.50, // per million notifications (mobile push)
  email: 2.00, // per 100,000 emails
  http: 0.06, // per 100,000 HTTP/HTTPS notifications
  sqs: 0.00, // Free to SQS
  lambda: 0.00, // Free to Lambda
};

// Data transfer pricing (per GB)
export const SNS_DATA_TRANSFER = {
  first1GB: 0.00, // Free
  next9_999GB: 0.09,
  over10TB: 0.085,
};

// SMS pricing varies by country (US examples)
export const SNS_SMS_PRICING = {
  promotional: 0.00645, // per SMS
  transactional: 0.00645, // per SMS
};

// Main cost calculation function
export function calculateSNSCost(config) {
  const {
    publishRequests = 1000000, // 1 million
    standardNotifications = 1000000,
    smsNotifications = 0,
    emailNotifications = 0,
    mobileNotifications = 0,
    httpNotifications = 0,
    sqsNotifications = 0,
    lambdaNotifications = 0,
    dataTransferGB = 10,
  } = config;

  // Publish API cost
  const publishCost = (publishRequests / 1000000) * SNS_REQUEST_PRICING.publishAPI;

  // Notification costs
  const standardCost = (standardNotifications / 1000000) * SNS_REQUEST_PRICING.standard;
  const smsCost = smsNotifications * SNS_REQUEST_PRICING.sms;
  const emailCost = (emailNotifications / 100000) * SNS_REQUEST_PRICING.email;
  const mobileCost = (mobileNotifications / 1000000) * SNS_REQUEST_PRICING.mobile;
  const httpCost = (httpNotifications / 100000) * SNS_REQUEST_PRICING.http;
  const sqsCost = 0; // Free
  const lambdaCost = 0; // Free

  const notificationCost = standardCost + smsCost + emailCost + mobileCost + httpCost + sqsCost + lambdaCost;

  // Data transfer cost
  let dataTransferCost = 0;
  let remaining = dataTransferGB;

  if (remaining > 1) {
    remaining -= 1; // First 1GB free
    const next9_999 = Math.min(remaining, 9999);
    dataTransferCost += next9_999 * SNS_DATA_TRANSFER.next9_999GB;
    remaining -= next9_999;

    if (remaining > 0) {
      dataTransferCost += remaining * SNS_DATA_TRANSFER.over10TB;
    }
  }

  const monthlyCost = publishCost + notificationCost + dataTransferCost;

  return {
    service: 'SNS',
    publishCost,
    standardCost,
    smsCost,
    emailCost,
    mobileCost,
    httpCost,
    sqsCost,
    lambdaCost,
    notificationCost,
    dataTransferCost,
    monthlyCost,
    annualCost: monthlyCost * 12,
    breakdown: [
      {
        category: 'Publish API Requests',
        description: `${publishRequests.toLocaleString()} requests`,
        monthlyCost: publishCost,
      },
      {
        category: 'Standard Notifications',
        description: `${standardNotifications.toLocaleString()} notifications`,
        monthlyCost: standardCost,
      },
      {
        category: 'SMS Notifications',
        description: `${smsNotifications.toLocaleString()} SMS`,
        monthlyCost: smsCost,
      },
      {
        category: 'Email Notifications',
        description: `${emailNotifications.toLocaleString()} emails`,
        monthlyCost: emailCost,
      },
      {
        category: 'Mobile Push Notifications',
        description: `${mobileNotifications.toLocaleString()} notifications`,
        monthlyCost: mobileCost,
      },
      {
        category: 'HTTP/HTTPS Notifications',
        description: `${httpNotifications.toLocaleString()} notifications`,
        monthlyCost: httpCost,
      },
      {
        category: 'Data Transfer',
        description: `${dataTransferGB} GB`,
        monthlyCost: dataTransferCost,
      },
    ],
    configuration: {
      publishRequests,
      standardNotifications,
      smsNotifications,
      emailNotifications,
      mobileNotifications,
      httpNotifications,
      dataTransferGB,
    },
  };
}

// Use case templates
export const SNS_USE_CASE_TEMPLATES = [
  {
    name: 'Email Notifications',
    description: 'Simple email notification system',
    config: {
      publishRequests: 100000,
      standardNotifications: 0,
      smsNotifications: 0,
      emailNotifications: 100000,
      mobileNotifications: 0,
      httpNotifications: 0,
      sqsNotifications: 0,
      lambdaNotifications: 0,
      dataTransferGB: 1,
    },
  },
  {
    name: 'Mobile App Notifications',
    description: 'Push notifications for mobile app',
    config: {
      publishRequests: 10000000,
      standardNotifications: 0,
      smsNotifications: 0,
      emailNotifications: 0,
      mobileNotifications: 10000000,
      httpNotifications: 0,
      sqsNotifications: 0,
      lambdaNotifications: 0,
      dataTransferGB: 50,
    },
  },
  {
    name: 'Multi-Channel Notifications',
    description: 'SMS, email, and mobile notifications',
    config: {
      publishRequests: 5000000,
      standardNotifications: 1000000,
      smsNotifications: 50000,
      emailNotifications: 500000,
      mobileNotifications: 3000000,
      httpNotifications: 500000,
      sqsNotifications: 0,
      lambdaNotifications: 0,
      dataTransferGB: 100,
    },
  },
  {
    name: 'Serverless Event Fan-out',
    description: 'SNS to Lambda and SQS for event processing',
    config: {
      publishRequests: 50000000,
      standardNotifications: 0,
      smsNotifications: 0,
      emailNotifications: 0,
      mobileNotifications: 0,
      httpNotifications: 0,
      sqsNotifications: 30000000,
      lambdaNotifications: 20000000,
      dataTransferGB: 200,
    },
  },
];

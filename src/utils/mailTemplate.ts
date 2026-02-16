export const getVerificationEmailTemplate = (verificationLick: any) => {
	return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            background-color: #007bff;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
          }
          .email-header h1 {
            margin: 0;
            font-size: 24px;
          }
          .email-body {
            padding: 30px;
            text-align: center;
          }
          .email-body h2 {
            font-size: 20px;
            color: #333333;
            margin-bottom: 20px;
          }
          .verification-code {
            font-size: 20px;
            font-weight: bold;
            color: #007bff;
            margin: 20px 0;
            background-color: #f1f9ff;
            display: inline-block;
            border-radius: 8px;
            border: 1px solid #007bff;
          }
          .email-footer {
            text-align: center;
            padding: 20px;
            color: #777777;
            font-size: 12px;
            background-color: #f7f7f7;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }
          .email-footer a {
            color: #007bff;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="email-body">
            <h2>Your Verification Link</h2>
            <div class="">
            <a href="${verificationLick}" >Click here to verify</a>
            </div>
            <p>Please Click this Link to complete your verification process.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
          <div class="email-footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};

export const getWelcomeEmailTemplate = (
	name: string,
	verificationLink?: any,
) => {
	return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 30px auto;
          background-color: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          background-color: #007bff;
          color: #ffffff;
          text-align: center;
          padding: 20px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .email-header h1 {
          margin: 0;
          font-size: 24px;
        }
        .email-body {
          padding: 30px;
          text-align: center;
        }
        .email-body h2 {
          font-size: 20px;
          color: #333333;
          margin-bottom: 20px;
        }
        .email-body p {
          color: #555555;
          line-height: 1.6;
          margin: 10px 0;
        }
        .welcome-message {
          font-size: 18px;
          font-weight: bold;
          color: #007bff;
          margin: 20px 0;
          background-color: #f1f9ff;
          display: inline-block;
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid #007bff;
        }
        .email-footer {
          text-align: center;
          padding: 20px;
          color: #777777;
          font-size: 12px;
          background-color: #f7f7f7;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .email-footer a {
          color: #28a745;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Welcome to Our Community!</h1>
        </div>
        <div class="email-body">
          <h2>Hi ${name},</h2>
          <p>We’re thrilled to have you here! 🎉</p>
          <div class="welcome-message">Welcome Aboard!</div>
          <p>Explore our platform and make the most out of your experience. If you have any questions, we’re just an email away.</p>
          <p>Let’s make something great together!</p>
        </div>
        <div class="email-footer">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

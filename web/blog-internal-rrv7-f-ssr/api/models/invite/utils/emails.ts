import { Config, emails } from "gadget-server";

export const sendInviteEmail = async (email: string, code: string) => {
  const url = new URL("/sign-up", Config.appUrl);
  url.searchParams.append("inviteCode", code);

  await emails.sendMail({
    to: email,
    subject: "You've been invited to join our team",
    html: emails.render(InviteTemplate, { url }),
  });
}

const InviteTemplate = `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en" xml:lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--[if !mso]>
<!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title></title>
    <style type="text/css">
      /* iOS BLUE LINKS */
      a[x-apple-data-detectors] {
        color: inherit !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
    </style>
    <style type="text/css">
      a,
      body,
      table,
      td,
      th {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        box-sizing: border-box !important;
      }
      table,
      td {
        mso-table-lspace: 0;
        mso-table-rspace: 0;
      }

      table {
        border-collapse: collapse !important;
      }
      body {
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
      }
      sup {
        *vertical-align: baseline;
        *position: relative;
        *bottom: .75em;
        font-size: 0.65em;
        line-height: 0;
      }
      p {
        margin-top: 8px;
        margin-bottom: 16px;
        /* This helps with paragraph spacing in Yahoo! */
      }
      @media only print and (max-width: 570px) {
        body {
          max-width: 320px;
        }
      }
      @media all and (max-width: 570px) {
        .outerContainer {
          width: 100% !important;
        }
        .innerContainer {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .fullWidth {
          width: 100% !important;
          display: block !important;
        }
        u~div #full-wrap {
          min-width: 100vw;
        }
        h1.hero-h1 {
          font-size: 36px !important;
          line-height: 40px !important;
          -webkit-text-size-adjust: none !important;
        }
        h2.body-h2 {
          font-size: 24px !important;
          line-height: 28px !important;
          -webkit-text-size-adjust: none !important;
        }
        h3.body-h3-link {
          font-size: 16px !important;
          line-height: 20px !important;
          -webkit-text-size-adjust: none !important;
        }
        h3.body-h3 {
          font-size: 16px !important;
          line-height: 20px !important;
          -webkit-text-size-adjust: none !important;
        }
        h4.body-h4-link {
          font-size: 14px !important;
          line-height: 18px !important;
          -webkit-text-size-adjust: none !important;
        }
        p.body-p-lg {
          font-size: 36px !important;
          line-height: 43px !important;
          -webkit-text-size-adjust: none !important;
        }
        p.body-p-sm {
          font-size: 14px !important;
          line-height: 22px !important;
          -webkit-text-size-adjust: none !important;
        }
        p.body-p-xs {
          font-size: 12px !important;
          line-height: 20px !important;
          -webkit-text-size-adjust: none !important;
        }
        .ph-30 {
          padding-left: 30px !important;
          padding-right: 30px !important;
        }
        .ph-15 {
          padding-left: 15px !important;
          padding-right: 15px !important;
        }
        .show {
          display: block !important;
          max-height: none !important;
          overflow: visible !important;
        }
        .hide {
          display: none !important;
        }
        .bt-1 {
          border-top: 1px solid #f6f6f6 !important;
        }
        .bt-0 {
          border-top: 0px solid #ffffff !important;
        }
        .bt-15 {
          border-top: 15px solid #ffffff !important;
        }
        .bb-5 {
          border-bottom: 5px solid #f6f6f6 !important;
        }
        .bgcolor-m {
          background-color: #f6f6f6 !important;
        }
        .bgcolor-white-m {
          background-color: #ffffff !important;
        }
        .ph-0 {
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
        .pt-40 {
          padding-top: 40px !important;
        }
        .pt-30 {
          padding-top: 30px !important;
        }
        .pt-20 {
          padding-top: 20px !important;
        }
        .pt-37 {
          padding-top: 37px !important;
        }
        .pb-40 {
          padding-bottom: 40px !important;
        }
        .pb-30 {
          padding-bottom: 30px !important;
        }
        .pb-27 {
          padding-bottom: 27px !important;
        }
        .ph-20 {
          padding-left: 20px !important;
          padding-right: 20px !important;
        }
        .pb-15 {
          padding-bottom: 15px !important;
        }
        .pt-8 {
          padding-top: 8px !important;
        }
        .pb-8 {
          padding-bottom: 8px !important;
        }
        .pb-4 {
          padding-bottom: 4px !important;
        }
        .pb-0 {
          padding-bottom: 0px !important;
        }
        .pr-0 {
          padding-right: 0px !important;
        }
        .ph-24 {
          padding-left: 24px !important;
          padding-right: 24px !important;
        }
        .pt-0 {
          padding-top: 0px !important;
        }
        .width-100 {
          width: 100% !important;
        }
        .width-70 {
          width: 70% !important;
        }
        .center {
          margin: 0 auto !important;
        }
        .center-align-text {
          text-align: center !important;
        }
        .stack {
          display: block !important;
        }
        .cta.stack a {
          width: 100% !important;
        }
        .height-580 {
          height: 580px !important;
          background-position: bottom !important;
        }
      }
      @media all and (max-width: 480px) {
        .height-640-480 {
          height: 640px !important;
        }
        .height-250-480 {
          height: 250px !important;
        }
      }
      @media all and (max-width: 425px) {
        .stack-425 {
          display: block !important;
          width: 100% !important;
        }
        .resume-3x-sm {
          background-image: url('http://offers.indeed.com/rs/699-SXJ-715/images/3X-resume-bg-sm.png') !important;
          height: 250px !important;
        }
      }
      @media all and (max-width: 380px) {
        .height-200-380 {
          height: 200px !important;
        }
        .pr-8-380 {
          padding-right: 8px !important;
        }
      }
      @media all and (max-width: 360px) {
        .stack-360 {
          display: block !important;
          width: 100% !important;
        }
        .stack-360 a {
          width: 100% !important;
        }
        h2.body-h2-360 {
          font-size: 20px !important;
          line-height: 24px !important;
          -webkit-text-size-adjust: none !important;
        }
        .width-180 {
          width: 180px !important;
        }
        .width-200 {
          width: 200px !important;
        }
        p.body-p-sm-360 {
          font-size: 14px !important;
          line-height: 22px !important;
          -webkit-text-size-adjust: none !important;
        }
        .pt-20-360 {
          padding-top: 20px !important;
        }
      }
      @media all and (max-width: 340px) {
        .height-179-340 {
          height: 179px !important;
        }
        .width-185-340 {
          width: 185px !important;
        }
        .pr-5-340 {
          padding-right: 5px !important;
        }
      }
    </style>
  </head>
  <body text="#2A2226" alink="#3535CE" link="#3535CE" vlink="#3535CE" bgcolor="#f6f6f6" style="margin:0;padding:0;">
    <!--END MASTHEAD LOGO MODULE-->
    <!--HERO MODULE-->
    <table width="100%" bgcolor="#f6f6f6" border="0" cellspacing="0" cellpadding="0" style="min-width:100%;" role="presentation">
      <tr>
        <td align="center" valign="top">
          <table width="100%" border="0" bgcolor="#ffffff" cellspacing="0" cellpadding="0" class="outerContainer" style="width:570px;max-width:570px;" role="presentation">
            <tr>
              <td align="left" valign="top" class="ph-15">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width:100%;" role="presentation">
                  <tr>
                    <td align="center" valign="top"  width="570" height="500" class="height-580 height-640-480">

                      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                        <tr>
                          <td align="left" valign="top">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="min-width:100%;" role="presentation">
                              <tr>
                                <td align="left" valign="top" class="ph-30" style="padding:0 65px;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                                    <tr>
                                      <td valign="top" class="pt-40 pt-20-360" style="padding:100px 0px 18px;">
                                        <p style="font-family: sans-serif;letter-spacing:-0.12px;font-size:14px;line-height:17px;font-weight:bold;color:#6f6f6f;Margin:0;padding:0;">
                                          Welcome to the team,
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td valign="top" style="padding:0px 0px 21px;">
                                        <h1 style="font-family:sans-serif;letter-spacing:-0.12px;font-size:28px;line-height:120%;font-weight:bold;color:#000000;Margin:0;padding:0;" class="hero-h1">
                                          Complete the sign-up process.
                                        </h1>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td valign="top" class="pr-0" style="padding:0px 96px 0px 0px;">
                                        <p style="padding:0;Margin:0;font-family:sans-serif;letter-spacing:-0.12px;font-size:18px;line-height:28px;color:#4B4B4B;font-weight:normal;">
                                          To finish your account setup, click the button below:
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                        <tr>
                          <td align="left" valign="top" class="ph-30" style="padding:0 0 0 65px;">
                            <!-- primary cta -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                              <tr>
                                <td align="left" class="cta stack center-align-text" valign="top" style="padding:24px 0 0;">
                                  <div>

                                    <a  style="background-color:#3535CE;color:#FFFFFF;display:inline-block;font-family:'Arial', Helvetica, Arial, 'Liberation Sans', Roboto, Noto, sans-serif;font-size:14px;font-weight:700;line-height:50px;text-align:center;text-decoration:none;width:220px;-webkit-text-size-adjust:none;mso-hide:all;border-radius:6px;" href=<%= url  %>>Continue sign-up</a>
                                  </div>
                                </td>
                              </tr>
                            </table>

                          </td>

                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
</html>
`;
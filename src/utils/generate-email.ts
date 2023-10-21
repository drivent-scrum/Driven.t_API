import { Payment, User, Event } from '@prisma/client';
import sgMail from '@sendgrid/mail';
import { TicketWithType } from '@/services';

export async function generateEmail(
  user: User,
  ticket: TicketWithType,
  paymentData: Payment,
  eventData: Event,
  price: number,
) {
  const headHtml = generateHeadHtml(eventData);
  const bodyHtml = generateBodyHtml(ticket, paymentData, eventData, price);

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      ${headHtml}
      ${bodyHtml}
    </html>
  `;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const message = {
    to: user.email,
    from: 'noreply.drivent@gmail.com',
    subject: 'Drivent - Compra realizada com sucesso',
    text: 'Confirmação de compra de ingresso',
    html: emailHtml,
  };

  await sgMail.send(message);
}

function generateHeadHtml(eventData: Event) {
  const { backgroundImageUrl } = eventData;
  const headHtml = `
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333333;
        }

        tbody {
          display: table-row-group;
          vertical-align: middle;
          border-color: inherit;
        }

        h1 {
          color: #3f3f3f;
          word-break: break-word;
          padding: 0 1.5em;
        }

        h2 {
          color: #3f3f3f;
          word-break: break-word;
          margin: 0.5em;
        }

        h3 {
          margin: 0;
          font-size: 1.3em;
        }

        h4, p {
          margin: 0;
          padding: 0.5em 0;
        }

        hr {
          width: 100%;
        }

        strong {
          font-weight: bold;
        }

        .page {
          background: ${backgroundImageUrl};
          background-size: cover;
          width: 100%;
        }

        .title {
          background-color: #e6e6e6;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .wrapper {
          padding: 10px 40px;
          font-size:15px;
          line-height:20px;
        }

        .content {
          padding: 0px 40px;
          font-size:15px;
          line-height:20px;
          text-align: center;
        }

        .logoImg {
          width: 50%;
          padding-top: 0.5em;
          padding-bottom: 1.5em;
        }

        .row {
          display: flex;
          justify-content: space-between;
        }
      </style>
    </head>
  `;

  return headHtml;
}

function generateBodyHtml(ticket: TicketWithType, paymentData: Payment, eventData: Event, price: number) {
  const { TicketType } = ticket;
  const { ticketId } = paymentData;
  const { title, logoImageUrl, endsAt } = eventData;

  function formatTicketMessage() {
    let message = '';
    if (TicketType.isRemote) {
      message += 'online';
      return message;
    }

    if (!TicketType.includesHotel) message += 'presencial';
    else message += 'presencial + hotel';

    return message;
  }

  function formatDate(ISOdate: Date) {
    const date = new Date(ISOdate);

    const day = date.getDate();
    const month = date.getMonth() + 1;

    let formatedDate = `${day}/${month}`;
    if (day < 10) formatedDate = `0${formatedDate}`;

    return formatedDate;
  }

  function formatValue(value: number, precision = 0) {
    return ((value ?? 100) / 100).toFixed(precision);
  }

  const formatedTicketMessage = formatTicketMessage();
  const formatedDate = formatDate(endsAt);
  const formatedValue = formatValue(price);

  const bodyHtml = `
    <body>
      <center class="page">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="background-color: #ffffff; border: 1px solid #a9a9a9;">
          <tbody>
            <tr>
              <td class="title">
                <h1>Compra Realizada - ${title}</h1>
              </td>
            </tr>
            <tr>
              <td class="wrapper">
                <p>Olá, </p>
                <p>Sua compra <strong># ${ticketId}</strong> foi efetuada com sucesso!</p>
                <hr />
              </td>
            </tr>
            <tr>
              <td class="content">
                <h2>${title}</h2>
                <p>${formatedDate}</p>
                <img class="logoImg" src=${logoImageUrl} alt="logo" />
                <hr />
                </td>
            </tr>
            <tr>
              <td class="wrapper">
                <h3>Resumo do pedido</h3>
                <p>Pedido # ${ticketId}</p>
                <hr />
                <table width="100%">
                  <tbody>
                    <tr class="row">
                      <td width="95%">
                        <h4>Ingresso</h4>
                      </td>
                      <td width="5%">
                        <h4>Valor</h4>
                      </td>
                    </tr>
                    <tr class="row">
                      <td width="95%">
                        <p>Ingresso ${formatedTicketMessage}</p>
                      </td>
                      <td width="5%">
                        <p>$${formatedValue}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </center>
    </body>
  `;

  return bodyHtml;
}

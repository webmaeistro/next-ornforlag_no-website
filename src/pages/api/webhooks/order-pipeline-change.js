import { getClient } from 'lib-api/payment-providers/vipps';
import { updateCrystallizeOrder } from 'lib-api/crystallize/order';

export default async (req, res) => {
  const {
    orders: { get: order }
  } = req.body;

  const inStages = order.pipelines.map(({ pipeline, stageId }) => ({
    pipeline: pipeline.name,
    stage: pipeline.stages?.find((s) => s.id === stageId)?.name
  }));

  console.log('Order pipeline update for', order.id);
  console.log('The order is in', inStages.length, 'pipeline(s)');
  console.log(inStages);

  const actions = [];

  const ornpipePipeline = inStages.find((p) => p.pipeline === 'ornpipe');
  if (ornpipePipeline) {
    switch (ornpipePipeline.stage) {
      case 'ny-ordre':
        actions.push('Notify staff of new order');

        break;

      case 'pakking':
        actions.push(
          'Inform the user: Boken blir pakket og gjort klar for sending '
        );
        break;
      case 'postet':
        // Vipps capture
        await getClient().capture({
          orderId: order.id,
          body: {
            merchantInfo: {
              merchantSerialNumber: process.env.VIPPS_MERCHANT_SERIAL
            },
            transaction: {
              amount: (99 + order.total.gross) * 100,
              transactionText:
                'ornforlag.no, netthandel transaksjon: capturePayment'
            }
          }
        });

        await updateCrystallizeOrder({
          id: order.id,
          additionalInformation: JSON.stringify({
            status: 'CAPTURED'
          })
        });

        break;

      case 'refund':
        await getClient().canceled({
          orderId: order.id,
          body: {
            merchantInfo: {
              merchantSerialNumber: process.env.VIPPS_MERCHANT_SERIAL
            },
            transaction: {
              amount: (99 + order.total.gross) * 100,
              transactionText: 'ornforlag.no netthandel transakson: canceld'
            }
          }
        });

        await updateCrystallizeOrder({
          id: order.id,
          additionalInformation: JSON.stringify({
            status: 'CANCELD'
          })
        });
    }
  }

  res.send('received');
};

import Pusher from 'pusher';

const channels = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: 'eu'
});

export default (req, res) => {
  console.log('webhook received', new Date());
  console.log(JSON.stringify(req.body, null, 3));
  channels.trigger('webhooks', 'incoming-webhook', JSON.stringify(req.body));

  res.send('received');
  res.send('webhook received');
};

// const express = require('express');
// const cors = require('cors');
// const { google } = require('googleapis');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const youtube = google.youtube('v3');
// const API_KEY = process.env.YOUTUBE_API_KEY;

// app.get("/",(req,res)=>{
//     res.json({message:"Hello World!"})
// })

// app.post('/api/youtube/connect', async (req, res) => {
//   const { channelId } = req.body;
  
//   try {
//     // Get channel information
//     const channelResponse = await youtube.channels.list({
//       key: API_KEY,
//       id: channelId,
//       part: 'snippet,statistics'
//     });

//     if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
//       return res.status(404).json({ error: 'Channel not found' });
//     }

//     const channel = channelResponse.data.items[0];

//     // Get recent videos
//     const videosResponse = await youtube.search.list({
//       key: API_KEY,
//       channelId: channelId,
//       part: 'snippet',
//       order: 'date',
//       type: 'video',
//       maxResults: 10
//     });

//     const formattedResponse = {
//       socials: {
//         followers: channel.statistics.subscriberCount,
//         username: channel.id,
//         name: channel.snippet.title,
//         profileImage: channel.snippet.thumbnails.default.url
//       },
//       posts: videosResponse.data.items.map(video => ({
//         id: video.id.videoId,
//         platform: 'youtube',
//         type: 'video',
//         post_type: 'recent',
//         title: video.snippet.title,
//         thumbnail: video.snippet.thumbnails.medium.url,
//         publishedAt: video.snippet.publishedAt
//       }))
//     };

//     res.json(formattedResponse);
//   } catch (error) {
//     console.error('Error fetching YouTube data:', error);
//     res.status(500).json({ error: 'Failed to fetch YouTube data' });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });







const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST']
}));
app.use(express.json());

// OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/callback'
);

// Define YouTube API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/userinfo.profile'
];

// Generate OAuth URL
app.get('/api/auth/url', (req, res) => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      include_granted_scopes: true
    });
    console.log('Generated auth URL:', authUrl); // Debug log
    res.json({ url: authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// Handle OAuth callback
app.post('/api/auth/token', async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    console.error('No code provided');
    return res.status(400).json({ error: 'Authorization code is required' });
  }


  try {
    console.log('Received auth code:', code); // Debug log

    const { tokens } = await oauth2Client.getToken(code);
    console.log('Received tokens:', tokens); // Debug log

    oauth2Client.setCredentials(tokens);

    const youtube = google.youtube('v3');
    
    // Get authenticated user's channel
    const channelResponse = await youtube.channels.list({
      auth: oauth2Client,
      part: 'snippet,statistics',
      mine: true
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const channel = channelResponse.data.items[0];

    // Get recent videos
    const videosResponse = await youtube.search.list({
      auth: oauth2Client,
      channelId: channel.id,
      part: 'snippet',
      order: 'date',
      type: 'video',
      maxResults: 10
    });

    const formattedResponse = {
      socials: {
        followers: channel.statistics.subscriberCount,
        username: channel.id,
        name: channel.snippet.title,
        profileImage: channel.snippet.thumbnails.default.url
      },
      posts: videosResponse.data.items.map(video => ({
        id: video.id.videoId,
        platform: 'youtube',
        type: 'video',
        post_type: 'recent',
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.medium.url,
        publishedAt: video.snippet.publishedAt
      }))
    };

    res.json(formattedResponse);
  } catch (error) {
    console.error('Error during OAuth flow:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('OAuth2 Client configured with:');
  console.log('Client ID:', process.env.GOOGLE_CLIENT_ID);
  console.log('Redirect URI:', 'http://localhost:3000/auth/callback');
});
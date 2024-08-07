import React, { useEffect, useState } from 'react';
import './PlayVideo.css';
// import video1 from '../../assets/video.mp4';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import jack from '../../assets/jack.png';
import user_profile from '../../assets/user_profile.jpg';
import { API_KEY, value_converter } from '../../Data';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const PlayVideo = () => {

   const { videoId } = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  const fetchingVideoData = async () => {
    try {
      // Fetching video data
      const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
      const response = await fetch(videoDetails_url);
      const data = await response.json();

      // Check if data.items exists and has content
      if (data.items && data.items.length > 0) {
        setApiData(data.items[0]);
      } else {
        console.error('No video data found');
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
    }
  };

  const fetchOtherData = async () => {
    if (!apiData || !apiData.snippet) {
      return; // Skip fetching other data if apiData is not yet available
    }

    try {
      // Fetching channel data
      const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      const channelResponse = await fetch(channelData_url);
      const channelData = await channelResponse.json();

      if (channelData.items && channelData.items.length > 0) {
        setChannelData(channelData.items[0]);
      } else {
        console.error('No channel data found');
      }

      // Fetching comment data
      const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
      const commentResponse = await fetch(comment_url);
      const commentData = await commentResponse.json();

      if (commentData.items) {
        setCommentData(commentData.items);
      } else {
        console.error('No comment data found');
      }
    } catch (error) {
      console.error('Error fetching other data:', error);
    }
  };

  useEffect(() => {
    fetchingVideoData();
  }, [videoId]);

  useEffect(() => {
    if (apiData) {
      fetchOtherData();
    }
  }, [apiData]);

  return (
    <div className='play-video'>
      {/* <video src={video1} controls autoPlay muted></video> */}
      <iframe
        width="926"
        height="521"
        src={`https://www.youtube.com/embed/${videoId}`}
        title='sam'
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <h3>{apiData ? apiData.snippet.title : 'Title Here'}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : '16k'} Views &bull;{' '}
          {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ''}
        </p>
        <div>
          <span>
            <img src={like} alt="" />
            {apiData ? value_converter(apiData.statistics.likeCount) : 155}
          </span>
          <span>
            <img src={dislike} alt="" />
          </span>
          <span>
            <img src={share} alt="" />
            Share
          </span>
          <span>
            <img src={save} alt="" />
            Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData?.snippet?.thumbnails?.medium?.url || 'https://via.placeholder.com/88'} alt="Channel Thumbnail" />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : 'Channel Title Here'}</p>
          <span>
            {channelData ? value_converter(channelData.statistics.subscriberCount) : 100} Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>

      <div className="vid-discription">
        <p>{apiData ? apiData.snippet.description.slice(0, 250) : 'Description Here'}</p>
        <hr />
        <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 102} Comments</h4>
        {commentData.map((item, index) => (
          <div key={index} className="comment">
            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
            <div>
              <h3>
                {item.snippet.topLevelComment.snippet.authorDisplayName} <span>1 day ago</span>
              </h3>
              <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
              <div className="comment-action">
                <img src={like} alt="" />
                <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)} </span>
                <img src={dislike} alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayVideo;

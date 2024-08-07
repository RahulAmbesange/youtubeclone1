import React, { useEffect, useState } from 'react';
import './Recommended.css';
// import thumbnail1 from '../../assets/thumbnail1.png';
// import thumbnail2 from '../../assets/thumbnail2.png';
// import thumbnail3 from '../../assets/thumbnail3.png';
// import thumbnail4 from '../../assets/thumbnail4.png';
// import thumbnail5 from '../../assets/thumbnail5.png';
// import thumbnail6 from '../../assets/thumbnail6.png';
// import thumbnail7 from '../../assets/thumbnail7.png';
// import thumbnail8 from '../../assets/thumbnail8.png';
import { API_KEY, value_converter } from '../../Data';
import { Link } from 'react-router-dom';

const Recommended = ({ categoryId }) => {
  const [apiData, setApiData] = useState([]);

  const fetchData = async () => {
    try {
      const relatedVideo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
      const response = await fetch(relatedVideo_url);
      const data = await response.json();
      
      if (data.items) {
        setApiData(data.items);
      } else {
        console.error('No video data found');
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='recommended'>
      {apiData.map((item, index) => {
        // Check for thumbnail availability
        const thumbnailUrl =
          item.snippet?.thumbnails?.medium?.url ||
          'https://via.placeholder.com/210'; // Use a placeholder or default image

        return (
          <Link   
            to={`/video/${item.snippet.categoryId}/${item.id}`}
            key={index}
            className='side-video-list'
          >
            <img src={thumbnailUrl} alt={item.snippet?.title || 'Video thumbnail'} />
            <div className="vid-info">
              <h4>{item.snippet?.title || 'No title available'}</h4>
              <p>{item.snippet?.channelTitle || 'Unknown channel'}</p>
              <p>{value_converter(item.statistics?.viewCount) || '0'} Views</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Recommended;

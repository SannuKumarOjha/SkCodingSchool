import React, { useEffect, useState } from "react";

const API = "AIzaSyATCvWxwiV19BMBPayXT2TC8CgJGB7lGIg";
const channelId = "UCHZyoWI4QrLgqfLgNE44kjA";

var fetchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API}&channelId=${channelId}&part=snippet,id&order=date`;

const YtVideo = () => {
  const [allVideos, setAllVideos] = useState([]);

  useEffect(() => {
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((resJson) => {
        const result = resJson.items.map((doc) => ({
          ...doc,
          videoLink: "https://www.youtube.com/embed/" + doc.id.videoId,
        }));
        setAllVideos(result);
      });
  }, []);
  console.log(allVideos);
  return (
    <>
      <div className="text mb-12 pt-32">
        <h1 className="text-3xl text-center">YouTube API</h1>
      </div>
      <div className="pl-11 flex items-center justify-center flex-wrap gap-6">
        {allVideos.map((item) => {
          return (
            <div>
              <iframe
                width="460"
                height="215"
                src={item.videoLink}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default YtVideo;

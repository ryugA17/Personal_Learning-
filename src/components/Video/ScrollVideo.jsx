/**
 * ScrollVideo.jsx
 * ---------------
 * HTML5 <video> whose currentTime is mapped to scroll progress via GSAP.
 * Falls back to an animated gradient placeholder if no video file exists.
 *
 * Usage: drop your video into public/video/story.mp4
 */
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollVideo = React.memo(function ScrollVideo({
  src = '/video/story.mp4',
  fallbackText = 'Drop your video into public/video/story.mp4',
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [hasVideo, setHasVideo] = useState(true);

  useEffect(() => {
    // Attempt to load the video — if it fails, show fallback
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => setHasVideo(false);
    const handleLoaded = () => {
      // Map scroll progress (0→1) to video currentTime (0→duration)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      tl.to(video, {
        currentTime: video.duration || 10,
        ease: 'none',
      });
    };

    video.addEventListener('error', handleError);
    video.addEventListener('loadedmetadata', handleLoaded);

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadedmetadata', handleLoaded);
    };
  }, []);

  return (
    <div className="video-section" ref={containerRef} id="section-video">
      <div className="video-wrapper">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={src}
            muted
            playsInline
            preload="auto"
            style={{ display: hasVideo ? 'block' : 'none' }}
          />
        ) : (
          <div className="video-fallback">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎬</p>
              <p>{fallbackText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ScrollVideo;

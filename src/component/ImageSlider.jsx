/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const defaultImage = "https://aimstutorial.in/wp-content/uploads/2021/04/placeholder-78.png";

const MediaSlider = ({
   urlOptions = [],
   placeholderImage = "",
   isBlobVideo = false, //:::helpful when use to upload a img/video from systen to show in a slider.
   dynamicHeight = "300px"
}) => {
   const posterImage = placeholderImage?.search('blob') === -1 ? placeholderImage : defaultImage;
   useEffect(() => {
      const playPauseVideos = () => {
         document.addEventListener('play', function (e) {
            let videos = document.getElementsByTagName('video');
            for (let i = 0; i < videos.length; i++) {
               if (videos[i] !== e.target) videos[i].pause();
            }
         }, true);
      }
      playPauseVideos();
   }, []);

   const style = {
      contentWrapper: {
         height: dynamicHeight,//:::height of images::: 
         width: "auto",
         backgroundColor: "#e8e8e879",
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
      },
   }

   //:::Check Image Orientation:::
   // function imageType(url) {
   //    let orientation;
   //    const img = new Image();
   //    img.src = url;
   //    if (img?.naturalWidth > img?.naturalHeight) {
   //       orientation = 'landscape';
   //    } else if (img?.naturalWidth < img?.naturalHeight) {
   //       orientation = 'portrait';
   //    } else {
   //       orientation = 'even';
   //    }
   //    return orientation;
   // }

   return (<>
      <Carousel
         infiniteLoop
         useKeyboardArrows
         autoPlay={false}
         showThumbs={false}
         showIndicators={false}
         // className="carousel-slider"
         showStatus={urlOptions?.length > 1}>
         {urlOptions.map((item, index) => {
            let isVideo = false;
            let mp4 = item?.search(".mp4"), mov = item?.search(".mov"), avi = item?.search(".avi");
            if (mp4 > 0 || mov > 0 || avi > 0 || isBlobVideo) { isVideo = true }
            // const imageType = imageType(item); :::line 40:::

            return (
               <div style={style.contentWrapper} key={index}>
                  {isVideo === false ?
                     <img
                        src={item || defaultImage}
                        alt=""
                        style={{
                           height: "100%",
                           width: "100%",
                           objectFit: "contain",
                        }} />
                     :
                     <video
                        controlsList="nofullscreen" //stop open video in fullscreen by dblClick
                        autoPlay={false}
                        width="100%"
                        height="100%"
                        controls={true}
                        src={item}
                        // preload="auto"
                        lazyload="true"
                        loop
                        posterResizeMode="cover"
                        resizeMode="cover"
                        poster={posterImage || defaultImage}
                     />
                  }
               </div>
            );
         })}
      </Carousel>
   </>)
}

export default MediaSlider;

//:::./style.css:::
// .carousel .thumbs-wrapper {
//    margin: 0;
// }

// .carousel-slider .control-arrow {
//    height: 100px !important;
//    margin: auto 5px !important;
//    border-radius: 15px;
//    background: #555454cf !important;
// }
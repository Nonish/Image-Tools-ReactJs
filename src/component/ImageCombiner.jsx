/* eslint-disable react/prop-types */
import { memo, useEffect, useMemo, useState } from "react";

const ImageCombiner = ({
   firstImageTitle = "Upload Image 1",
   secondImageTitle = "Upload Image 2",
   combineBlobObj,
   enableDownload = false,
   defaultImage = ""
}) => {
   const [image1, setImage1] = useState(null);
   const [image2, setImage2] = useState(null);
   const [combinedImages, setCombinedImages] = useState(null);
   const blobObj = useMemo(() => ({}), []);

   const style = {
      outerWrapper: {
         display: "flex",
         justifyContent: "center",
         height: "350px",
         width: "100%",
      },
      innerWrapper: {
         display: "flex",
         flexDirection: "column",
         alignItems: "space-between",
         height: "100%",
         width: "100%",//"825px",
         backgroundColor: "#d9d9d9",
         borderRadius: "32px",
         border: "1.5px solid #fff",
         overflow: "hidden",
      },
      uploadWrapper: {
         height: "79.5%",
         border: "1.5px solid #fff",
         borderTopLeftRadius: "30px",
         borderTopRightRadius: "30px",
         padding: "15px",
         display: "flex",
         justifyContent: "center"
      },
      uploadBoxWrapper: {
         width: "48%",
         margin: "0 10px"
      },
      uploadBox: {
         flex: 1,
         height: "100%",
         border: "5px dashed #bfbfbf",
         borderRadius: "30px",
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
         fontSize: "26px",
         fontWeight: 700,
         color: "#737373",
         cursor: "pointer"
      },
      buttonWrapper: {
         display: "flex",
      },
      button: {
         padding: "10px",
         width: "100%",
         backgroundColor: "#d9d9d9",
         outline: "none",
         border: "1.5px solid #fff",
         fontSize: "16px",
         fontWeight: 700,
         color: "#737373",
         cursor: (!image1 || !image2) ? "not-allowed" : "pointer" //:::prevent clicking:::
      },
      imageViewerWrapper: {
         height: "100%",
         width: "auto",
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
         boxShadow: "8px 12px 23px -10px #000",
         borderRadius: "10px",
         backgroundColor: "#fff",
         position: "relative",
         padding: "5px",
         overflow: "hidden"
      },
      imageViewerContent: {
         height: "100%",
         width: "100%",
         objectFit: "contain",
      },
      icon: {
         width: "25px",
         height: "25px",
         position: "absolute",
         right: 0,
         top: 0,
         cursor: "pointer",
         borderBottomLeftRadius: "25%",
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
         backgroundColor: "#ff0000",
         paddingTop: "1px",
         fontWeight: 700,
         color: "#fff"
      }
   }

   useEffect(() => {
      if (defaultImage.length > 0) {
         setCombinedImages(defaultImage)
      }
   }, [defaultImage])

   const onHandleFileUpload = (event, name) => {
      event.preventDefault();
      const { files } = event.target;
      if (name === "image1") {
         setImage1(files[0])
      } else {
         setImage2(files[0]);
      }
   }

   const combineImages = async () => {
      try {
         setCombinedImages(null);
         if (!image1 || !image2) {
            alert("Please Upload both images");
         }
         const canvas = document.createElement("canvas");
         const ctx = canvas.getContext("2d");

         const img1 = new Image();
         const img2 = new Image();
         img1.src = URL.createObjectURL(image1);
         img2.src = URL.createObjectURL(image2);

         img1.onload = () => {
            canvas.width = Math.max(img1.width, img2.width) * 2//img1.width + img1.width; // Double the width for both images side by side
            canvas.height = Math.max(img1.height, img2.height); // Set canvas height to the maximum height of the images
            // ctx.fillRect(0, 0, canvas.width,  canvas.height);
            ctx.drawImage(img1, 0, 0);

            img2.onload = async () => {
               ctx.drawImage(img2, img1.width, 0); // Draw the second image next to the first one
               const base64 = canvas.toDataURL();
               setCombinedImages(base64);
               const args = await fetch(base64);
               const fileObj = await args?.blob();
               blobObj.url = window.URL.createObjectURL(fileObj);
               blobObj.file = new File([fileObj], `combined_image.png`, { type: 'image/png' });  //for convert fileObj fro upload.
               await combineBlobObj(blobObj);
            };
            // ctx.clearRect(0, 0, canvas.width,  canvas.height); // clean the canvas
         };
      } catch (error) {
         console.log("combineImages", error)
      }
   };

   const handleExport = () => {
      // Create a downloadable link for the combined image
      const link = document.createElement("a");
      link.href = combinedImages;
      link.download = "combined_image.png";
      link.click();
   };

   const onHandleRemove = (name) => {
      if (name === "image1") {
         setImage1(null)
      } else if (name === "image2") {
         setImage2(null);
      } else {
         setImage1(null);
         setImage2(null);
         setCombinedImages(null);
         combineBlobObj({})
      }
   }

   const ImageViewer = ({ imgFile, name, base64 }) => {
      return (
         <div style={style.imageViewerWrapper}>
            <img alt="remove-image"
               src={base64 ? base64 : URL.createObjectURL(imgFile)}
               style={style.imageViewerContent} />
            <div style={style.icon} onClick={() => onHandleRemove(name)}>&#10005;</div>
         </div>
      )
   }

   return (
      <>
         <div style={style.outerWrapper}>
            <div style={style.innerWrapper}>
               <div style={style.uploadWrapper} id="nonish">
                  {combinedImages ?
                     <ImageViewer
                        base64={combinedImages}
                        name={"combinedImages"} />
                     :
                     <>
                        <div style={style.uploadBoxWrapper}>
                           {image1 ?
                              <ImageViewer
                                 imgFile={image1}
                                 name={"image1"} />
                              :
                              <div
                                 onClick={() => document.getElementById('image1').click()}
                                 style={{
                                    ...style.uploadBox,
                                    // borderTopLeftRadius: "30px"
                                 }}>
                                 {firstImageTitle}
                              </div>}
                           <input
                              style={{ display: "none" }}
                              id="image1"
                              type="file"
                              accept={"image/jpg,image/png,image/jpeg"}
                              onChange={(e) => onHandleFileUpload(e, "image1")} />
                        </div>
                        <div style={style.uploadBoxWrapper}>
                           {image2 ?
                              <ImageViewer
                                 imgFile={image2}
                                 name={"image2"} />
                              :
                              <div
                                 onClick={() => document.getElementById('image2').click()}
                                 style={{
                                    ...style.uploadBox,
                                    // borderTopRightRadius: "30px"
                                 }}>
                                 {secondImageTitle}
                              </div>}
                           <input
                              style={{ display: "none" }}
                              id="image2"
                              type="file"
                              accept={"image/jpg,image/png,image/jpeg"}
                              onChange={(e) => onHandleFileUpload(e, "image2")} />
                        </div>
                     </>}
               </div>
               <div style={style.buttonWrapper}>
                  <button
                     disabled={!image1 || !image2}
                     onClick={combineImages}
                     style={{ ...style.button, borderBottomLeftRadius: "30px" }}>
                     Combine Images
                  </button>
                  {enableDownload && <button
                     disabled={!image1 || !image2}
                     onClick={handleExport}
                     style={{ ...style.button, borderBottomRightRadius: "30px" }}>
                     Download
                  </button>}
               </div>
            </div>
         </div>
      </>
   );
}

export default memo(ImageCombiner)

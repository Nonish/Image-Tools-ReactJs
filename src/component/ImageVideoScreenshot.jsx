/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { forwardRef, useMemo, useRef } from 'react'
import html2canvas from 'html2canvas'

const Screenshot = forwardRef((props, ref) => {
   const canvasRef = useRef();
   const {
      fileName,
      // childCallback
   } = props;
   const { ref1, ref2 } = ref;
   // const blobObj = useMemo(() => ({}), []); 

   async function onHandleSnap() {
      try {
         captureVideos();
         let getCanvas = await html2canvas(ref1.current);
         getCanvas.toBlob(async (blob) => {
            // const base64 = getCanvas.toDataURL();
            // const args = await fetch(base64);
            // const fileObj = await args?.blob();
            // blobObj.url = window.URL.createObjectURL(fileObj);
            // blobObj.file = new File([fileObj], `Combine_images.png`, { type: 'image/png' });  //for convert fileObj fro upload.
            // childCallback(blobObj) 

            let link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);//clear browser memory from it
         }, 'image/png');
      } catch (e) {
         console.log('onHandleSnap', e);
      }
   }

   function captureVideos() {
      let canvas = canvasRef.current; // declare a canvas element in your html
      let ctx = canvas.getContext("2d");
      let videos = ref2.current;
      // let image = ref3.current;
      let w, h;
      for (let i = 0, len = videos.length; i < len; i++) {
         const v = videos[i];
         console.log(v.src);
         if (!v.src) continue; // no video here
         try {
            w = v.videoWidth;
            h = v.videoHeight;
            canvas.width = w;
            canvas.height = h;
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(v, 0, 0, w, h);
            const a = canvas.toDataURL();
            v.style.backgroundImage = `url(${a})`;
            v.style.backgroundSize = "cover";
            ctx.clearRect(0, 0, w, h); // clean the canvas
         } catch (e) {
            console.log(e);
            continue;
         }
      }
   }

   return (<>
      <button onClick={onHandleSnap}>On Capture</button>
      <canvas crossOrigin="anonymous" ref={canvasRef} hidden />
      {/* <img id="img" crossOrigin="anonymous" />  //for show ss on screen */}
   </>)
})

export default Screenshot;

// :::FOR-REFRENCE:::

// html2canvas(ref1.current).then(canvas => {
//    document.querySelector("img").src = canvas.toDataURL();
//    console.log(canvas.toDataURL())
// });

// html2canvas(.body).then(
// function (canvas) {
//    const a = document.createElement('a');
//    a.href = canvas.toDataURL("../../../../assets/images/jpeg").replace("image/jpeg", "image/octet-stream");
//    a.download = 'someFileName.jpg';
//    a.click();
//    // document.body.appendChild(canvas);
// })

// import jsPDF from "jspdf";
// const export PDF = () => {
//    const input = document.getElementById("App")
//    html2canvas(input, { logging: true, letterRendering: 1, useCORS: true }).then(canvas=>{
//    const imgWidth = 208;
//    const imgHeight = canvas.height * imgWidth / canvas.width;
//    const imgData = canvas.toDataURL('img/png');
//    const pdf = new jsPDF('p', 'mm', 'a4');
//    pdf.add Image(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
//    pdf.save("goatrank.pdf")
// })

import ImageCombiner from './component/ImageCombiner'
import ImageMagnifier from './component/ImageMagnifier';
import MediaSlider from './component/ImageSlider';

const App = () => {

  return (
    <>
      <section>
        <h2>Image Combiner</h2>
        <div style={style.flexContainer}>
          <ImageCombiner
            firstImageTitle='Upload Image 1'
            secondImageTitle='Upload Image 2'
            defaultImage="" //:::image-url/file[0]:::
            enableDownload
            combineBlobObj={(val) => console.log(val)} //:::Yow will get file data Object and Blob URL:::
          />
        </div>
      </section>
      <section>
        <h2>Image Magnifier</h2>
        <div style={style.flexContainer}>
          <ImageMagnifier
            width={"500px"}
            src={"https://laurenashpole.github.io/react-inner-image-zoom/images/unsplash-1.jpg"}
          />
        </div>
      </section>
      <section>
        <h2>Image Slider (using : <a href='https://www.npmjs.com/package/react-responsive-carousel'>react-responsive-carousel</a>)</h2>
        <div style={{ ...style.flexContainer, width: "800px" }}>
          <MediaSlider
            urlOptions={Array(5).fill("https://picsum.photos/200/300")}
          />
        </div>
      </section>
    </>
  )
}

export default App;

const style = {
  flexContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px 0",
    padding: "50px",
    border: "1px solid #ccc"
  }

}
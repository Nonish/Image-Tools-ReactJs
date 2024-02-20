import { useCallback, useState } from 'react'
import ImageCombiner from './component/ImageCombiner'

const App = () => {
  const [combineImage, setCombineImage] = useState({});

  console.log("combine-image", combineImage);

  return (
    <>
      <div style={{ width: "800px" }}>
        <ImageCombiner
          firstImageTitle='Upload Doc. Front'
          secondImageTitle='Upload Doc. Back'
          defaultImage="" //:::image-url/file[0]:::
          enableDownload
          combineBlobObj={useCallback((val) => setCombineImage(val), [])} />
      </div>
    </>
  )
}

export default App
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs"; // TensorFlow js
import * as cocossd from "@tensorflow-models/coco-ssd"; // Image Prediction Model
import "./App.css";

function App() {
  //Consts
  const imageRef = useRef(null);
  const [imageFile, setImageFile] = useState();
  const [model, setModel] = useState();
  const [results, setResults] = useState();

  //Initialize model 
  async function loadModel() {
    try {
      setModel(await cocossd.load());
    }
    catch (err) {
      console.error(err);
    }
  }

  //Upload image
  function handleImageChange(e) {
    setImageFile(URL.createObjectURL(e.target.files[0]));
  }

  //Predict objectsin image
  async function runPrediction() {
    if (imageRef?.current?.currentSrc) {
      const obj = await model.detect(imageRef.current);
      setResults(obj);
    }
  };

  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  return (
    <div className="App">
      <h2>Add Image For Prediction:</h2>
      <input type="file" onChange={handleImageChange} />

      <ul style={{ listStyle: 'none' }}>
        <h3>Items Found in Image:</h3>
        {results?.length > 0 ? results.map((result, index) =>
          <li key={index}>Object: <span style={{color: 'red', fontWeight: 'bold'}}>{result.class} </span> | Accuracy: <span style={{color: 'green', fontWeight: 'bold'}}>{ Math.floor(result.score * 100)}%</span></li>
        ) : <p>No predictions found!</p>}
      </ul>

      <img style={{ width: '700px', height: '500' }} ref={imageRef} onLoad={runPrediction} src={imageFile}/>
    </div>
  );
}

export default App;

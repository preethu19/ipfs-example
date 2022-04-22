import React, {useState} from 'react';
import { create } from "ipfs-http-client";
import './App.css';

const client = create('https://ipfs.infura.io:5001/api/v0');

const App = () => {
  const [urlArr, setUrlArr] = useState([]);
  const [image, setImage] = useState('')
  const [price, setPrice] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([])

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
        console.log("image added")
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !price || !name || !description) return
    try {
      const result = await client.add(JSON.stringify({image, price, name, description}))
      const uri = `https://ipfs.infura.io/ipfs/${result.path}`
      setUrlArr(prev => [...prev, uri]);   
      console.log(uri) 
      const response = await fetch(uri)
      const metadata = await response.json()
      console.log(metadata)
      setItems(prev => [...prev, {
        name: metadata.name,
        description: metadata.description,
        price: metadata.price,
        image: metadata.image
      }]);
      setName("")
      setDescription("")
      setPrice("")
      setImage("")
      console.log("item added")
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">IPFS Project</header>
      <div className="main">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter Name" onChange={(e) => setName(e.target.value)} value={name} /> <br />
          <input type="text" placeholder="Enter Description" onChange={(e) => setDescription(e.target.value)} value={description} /> <br />
          <input type="text" placeholder="Enter Price" onChange={(e) => setPrice(e.target.value)} value={price} /> <br />
          <input type="file" onChange={uploadToIPFS} /> <br />
          <button type="submit" className="button">Submit</button>
        </form>
      </div>

      <div className="display">
        {items.length !== 0
          ? items.map((item) => {
          return(
            <div>
            <h3>Name: {item.name}</h3>
            <h3>Description: {item.description}</h3>
            <h3>Price: {item.price}</h3>
            <img src={item.image} alt="nfts" />
            </ div>
            
          )
          })
          : <h3>Upload data</h3>}
      </div>
    </div>
  )
}

export default App;

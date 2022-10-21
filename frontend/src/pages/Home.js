import React, { useEffect, useState } from 'react';
import { Image } from 'cloudinary-react';

export default function Home() {
    const [imageIds, setImageIds] = useState();
    const loadImages = async () => {
        try {
            const res = await fetch('/api/images');
            const data = await res.json();
            setImageIds(data);
        } catch (err) {
            console.error("ERRO: ",err);
        }
    };
    useEffect(() => {
        loadImages();
    }, []);

    const handleDelete = async (id) => {
        try {
            await fetch('https://cloudinary-api-crud.herokuapp.com/api/delete', {
                method: 'POST',
                body: JSON.stringify({ data: id }),
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
        console.error("Error: ",error);
        }
    };

    return (
        <div>
            <h1 className="title">Cloudinary Gallery</h1>
            <div className="gallery">
                {imageIds &&
                    imageIds.map((imageId, index) => (
                        <Image
                            key={index}
                            cloudName={process.env.REACT_APP_CLOUDINARY_NAME}
                            publicId={imageId}
                            width="300"
                            crop="scale"
                            onClick={() => handleDelete(imageId)}
                        />
                    ))}
            </div>
        </div>
    );
}

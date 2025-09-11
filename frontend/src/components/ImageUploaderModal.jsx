import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import "../styles/ImageUploaderModal.css";

const ImageUploaderModal = ({ onClose, onImageChange, maxSizeMB = 3 }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onDrop = useCallback((files) => {
    const file = files[0];
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`El archivo supera los ${maxSizeMB} MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  }, [maxSizeMB]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false
  });

  const onCropComplete = useCallback((croppedArea, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const file = new File([croppedBlob], "plant.jpeg", { type: "image/jpeg" });
    onImageChange(file);
    onClose(); // cerrar modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>

        {!imageSrc ? (
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Suelta la imagen aquí</p>
            ) : (
              <p>Arrastra o haz click para subir una imagen</p>
            )}
          </div>
        ) : (
          <div className="crop-wrapper">
            {/* Panel superior: botones y slider */}
            <div className="crop-top-panel">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
              />
              <div className="button-group">
                <button type="button" className="btn" onClick={handleSave}>
                  Guardar
                </button>
                <button type="button" className="btn" onClick={() => setImageSrc(null)}>
                  Eliminar
                </button>
              </div>
            </div>

            {/* Panel inferior: imagen a recortar */}
            <div className="crop-bottom-panel">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploaderModal;

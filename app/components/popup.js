"use client"
import * as htmlToImage from "html-to-image";
import { IoCloseOutline } from "react-icons/io5";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { setPopUpVisible } from "../redux/qrCodePopUpContent";
import { useRef } from "react";

function Popup () {
    const popUpContent = useSelector(state => state.qrCodePopUp);
    const dispatch = useDispatch();
    const qrCodeRef = useRef(null);

    const downloadQRCode = () => {
        htmlToImage
          .toPng(qrCodeRef.current)
          .then(function (dataUrl) {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "qr-code.png";
            link.click();
          })
          .catch(function (error) {
            console.error("Error generating QR code:", error);
          });
      };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-3">
        <div className="bg-white p-4 rounded shadow-lg text-center relative">
          <button 
          className="absolute top-1 right-1 text-gray-500 hover:bg-gray-200 rounded-full"
          onClick={() => dispatch(setPopUpVisible())}
          >
            <IoCloseOutline size={24} />
          </button>
          <p className="mb-4 mt-3">Congratulations, the QR code has been successfully generated</p>
          <div className="w-full flex justify-center items-center mb-3">
            <QRCode ref={qrCodeRef} value={popUpContent.qrCodeData}/>
          </div>
          <button 
          onClick={()=>downloadQRCode()}
          className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 mr-2"
          >
            Download QR Code
          </button>
        </div>
      </div>
    );
}

export default Popup;